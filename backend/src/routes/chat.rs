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

    let (mut sink, mut stream) = socket.split();

    // NOTE:
    // mongodb::database::Database uses an `Arc` under the hood so we can
    // clone it!
    if let Err(_) = initialize_room(&params, state.database.clone()).await {
        return;
    }
    if let Ok(messages) = get_previous_messages(&params, state.database.clone()).await {
        let _ = sink
            .send(Message::Item(ServerMessage::PreviousMessages(messages)))
            .await;
    } else {
        return;
    }

    let messages_collection = state.database.collection::<db::Message>("messages");
    let users = state.database.collection::<db::User>("users");

    // NOTE:
    // this task looks for changes in the database and sends it through the sender
    let mut database_task = tokio::spawn(async move {
        let mut change_stream = messages_collection
            .watch(
                vec![doc! {
                    "$match": doc! {
                        "operationType": "insert",
                        "fullDocument.roomId": params.room_id,
                    }
                }],
                None,
            )
            .await
            .unwrap();

        while let Some(event) = change_stream.next().await.transpose().unwrap() {
            let message = event.full_document.unwrap();
            let user = users
                .find_one(doc! {"_id": &message.user_id}, None)
                .await
                .unwrap()
                .unwrap();

            let _ = sink
                .send(Message::Item(ServerMessage::Reply(MessageWithProfile {
                    _id: message._id,
                    room_id: message.room_id,
                    date_time: message.date_time,
                    user_id: message.user_id,
                    content: message.content,
                    profile_url: user.profile_url,
                })))
                .await;
        }
    });

    // NOTE:
    // this handles when the client sends a message instead of using a broadcast we make use of
    // mongodb change streams to record the chat message into the database
    // another task is listening to change streams and that handles sending the message to the
    // other clients
    let mut client_receiver_task = tokio::spawn(async move {
        while let Some(msg) = stream.next().await {
            match msg {
                Ok(Message::Item(msg)) => match msg {
                    ClientMessage::Message {
                        date_time,
                        content,
                        user_id,
                        room_id,
                    } => {
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
                    }

                    ClientMessage::Event { date_time, content } => {}
                },

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
        _ = (&mut database_task) => client_receiver_task.abort(),
        _ = (&mut client_receiver_task) => database_task.abort(),
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

#[derive(Serialize, Deserialize)]
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
    #[serde(rename = "_id")]
    pub _id: ObjectId,
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
