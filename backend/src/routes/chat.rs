use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use mongodb::bson::oid::ObjectId;

use crate::error::Result;
use crate::{database as db, state::AppState};
use mongodb::bson::{self, doc};
use std::sync::Arc;
use tokio::sync::broadcast::{self, Receiver, Sender};

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(param): Query<ConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(state, socket, param))
}

async fn handle_connection(
    state: Arc<AppState>,
    socket: WebSocket<ServerMessage, ClientMessage>,
    params: ConnectionArgs,
) {
    use futures::SinkExt;
    use futures::StreamExt;

    let (mut ws_sender, mut ws_receiver) = socket.split();

    // NOTE:
    // mongodb::database::Database uses an `Arc` under the hood so we can
    // clone it!
    if let Err(_) = initialize_room(&params, state.database.clone()).await {
        return;
    }
    if let Ok(messages) = get_previous_messages(&params, state.database.clone()).await {
        let _ = ws_sender
            .send(Message::Item(ServerMessage::PreviousMessages(messages)))
            .await;
    } else {
        return;
    }

    let users = state.database.collection::<db::User>("users");

    let mut message_tx = state.message_tx.subscribe();
    let sender = state.message_tx.clone();

    // listens to the broadcasted channels gets the complete information from the database and
    // sends it to the client
    let mut send_task = tokio::spawn(async move {
        while let Ok(message) = message_tx.recv().await {
            match message {
                ClientMessage::Message {
                    date_time,
                    content,
                    user_id,
                    room_id,
                } => {
                    let user = users
                        .find_one(doc! {"_id": &params.user_id}, None)
                        .await
                        .unwrap()
                        .unwrap();

                    let _ = ws_sender
                        .send(Message::Item(ServerMessage::Reply(MessageWithProfile {
                            room_id,
                            date_time,
                            user_id,
                            content,
                            profile_url: user.profile_url,
                        })))
                        .await;
                }

                ClientMessage::Event { date_time, content } => {}
            }
        }
    });

    // receives chat payload from the client and stores the message in the database and sendsit
    // through the connected clients over the websocket
    let mut receive_task = tokio::spawn(async move {
        while let Some(message) = ws_receiver.next().await {
            match message {
                Ok(Message::Item(msg)) => {
                    match msg {
                        ClientMessage::Message {
                            date_time,
                            content,
                            user_id,
                            room_id,
                        } => {
                            // we store the mesage here since if we do it in `send_task` it will be
                            // duplicated by other threads
                            let chat_message = db::Message {
                                _id: ObjectId::new(),
                                user_id,
                                room_id,
                                date_time,
                                content,
                            };

                            let messages_collection =
                                state.database.collection::<db::Message>("messages");

                            messages_collection
                                .insert_one(&chat_message, None)
                                .await
                                .unwrap();

                            let _ = sender.send(ClientMessage::Message {
                                date_time,
                                content: chat_message.content,
                                user_id: chat_message.user_id,
                                room_id: chat_message.room_id,
                            });
                        }

                        ClientMessage::Event { date_time, content } => {}
                    }
                }

                Ok(_) => {
                    println!("Invalid Message");
                    return;
                }

                Err(err) => {
                    println!("{:?}", err);
                    return;
                }
            }
        }
    });

    // If any one of the tasks run to completion, we abort the other.
    tokio::select! {
        _ = (&mut send_task) => receive_task.abort(),
        _ = (&mut receive_task) => send_task.abort(),
    };
}

async fn get_previous_messages(
    params: &ConnectionArgs,
    database: mongodb::Database,
) -> Result<Vec<MessageWithProfile>> {
    let messages_collection = database.collection::<db::Message>("messages");

    let pipeline = vec![
        doc! {
            "$match": {
                "roomId": params.room_id.clone(),
            }
        },
        doc! {
            "$lookup": {
                "from": "users",
                "localField": "userId",
                "foreignField": "_id",
                "as": "userInfo"
            }
        },
        doc! {
            "$unwind": "$userInfo"
        },
        doc! {
            "$project": {
                "_id": 1,
                "roomId": 1,
                "userId": 1,
                "content": 1,
                "dateTime": 1,
                "profileUrl": "$userInfo.profileUrl"
            }
        },
    ];

    let mut cursor = messages_collection.aggregate(pipeline, None).await?;
    let mut messages = Vec::new();

    use futures::StreamExt;

    while let Some(doc) = cursor.next().await.transpose()? {
        let chat_message: MessageWithProfile = bson::from_document(doc)?;
        messages.push(chat_message);
    }

    Ok(messages)
}

async fn initialize_room(params: &ConnectionArgs, database: mongodb::Database) -> Result<()> {
    let rooms_collection = database.collection::<db::Room>("rooms");

    let room = rooms_collection
        .find_one(doc! { "roomId": &params.room_id}, None)
        .await?;

    match room {
        Some(room) => {
            if !room.participants.contains(&params.user_id) {
                let filter = doc! { "roomId": &params.room_id};
                let update = doc! { "$push": doc!{"participants": &params.user_id }};
                let _ = rooms_collection.update_one(filter, update, None).await?;
            }
        }
        None => {
            let _ = rooms_collection
                .insert_one(
                    db::Room {
                        room_id: params.room_id.clone(),
                        participants: vec![],
                    },
                    None,
                )
                .await?;
        }
    }

    Ok(())
}

use crate::utils::get_time;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    room_id: String,
    user_id: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ClientMessage {
    #[serde(rename_all = "camelCase")]
    Message {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
        room_id: String,
        user_id: String,
    },

    #[serde(rename_all = "camelCase")]
    Event {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
    },
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MessageWithProfile {
    pub room_id: String,
    pub user_id: String,
    pub date_time: u64,
    pub content: String,
    pub profile_url: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ServerMessage {
    Reply(MessageWithProfile),
    PreviousMessages(Vec<MessageWithProfile>),
}
