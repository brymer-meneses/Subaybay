use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use mongodb::bson::oid::ObjectId;

use crate::{database as db, state::AppState};
use std::sync::Arc;

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
    use mongodb::bson::{self, doc};

    let (mut sender, mut receiver) = socket.split();

    let rooms_collection = state.database.collection::<db::Room>("rooms");
    let messages_collection = state.database.collection::<db::Message>("messages");
    let users = state.database.collection::<db::User>("users");

    // create room metadata if it doesn't exist yet
    {
        let room = rooms_collection
            .find_one(doc! { "roomId": &params.room_id}, None)
            .await
            .unwrap();

        match room {
            Some(room) => {
                if !room.participants.contains(&params.user_id) {
                    let filter = doc! { "roomId": &params.room_id};
                    let update = doc! { "$push": doc!{"participants": &params.user_id }};
                    let _ = rooms_collection.update_one(filter, update, None).await;
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
                    .await;
            }
        }
    }

    // send previous messages to the user
    {
        let pipeline = vec![
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
                    "roomId": 1,
                    "userId": 1,
                    "content": 1,
                    "dateTime": 1,
                    "messageId": 1,
                    "profileUrl": "$userInfo.profileUrl"
                }
            },
        ];

        let mut cursor = messages_collection.aggregate(pipeline, None).await.unwrap();
        let mut messages = Vec::new();

        while let Some(doc) = cursor.next().await {
            if let Ok(doc) = doc {
                let chat_message: ChatMessageWithProfile = bson::from_document(doc).unwrap();
                messages.push(chat_message);
            }
        }

        let _ = sender
            .send(Message::Item(ServerMessage::PreviousMessages(messages)))
            .await;
    }

    tokio::spawn(async move {
        let mut stream = messages_collection
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

        while let Some(event) = stream.next().await.transpose().unwrap() {
            let message = event.full_document.unwrap();
            let user = users
                .find_one(doc! {"_id": &message.user_id}, None)
                .await
                .unwrap()
                .unwrap();

            let _ = sender
                .send(Message::Item(ServerMessage::Reply(
                    ChatMessageWithProfile {
                        message_id: message.message_id,
                        room_id: message.room_id,
                        date_time: message.date_time,
                        user_id: message.user_id,
                        content: message.content,
                        profile_url: user.profile_url,
                    },
                )))
                .await;
        }
    });

    let messages_collection = state.database.collection::<db::Message>("messages");

    tokio::spawn(async move {
        while let Some(msg) = receiver.next().await {
            match msg {
                Ok(Message::Item(msg)) => match msg {
                    ClientMessage::Message {
                        date_time,
                        content,
                        user_id,
                        room_id,
                    } => {
                        let chat_message = db::Message {
                            message_id: ObjectId::new(),
                            user_id,
                            room_id,
                            date_time,
                            content,
                        };

                        messages_collection
                            .insert_one(&chat_message, None)
                            .await
                            .unwrap();
                    }

                    ClientMessage::Event { date_time, content } => {}
                },

                Ok(_) => {
                    println!("Invalid Message");
                }

                Err(err) => {
                    println!("{:?}", err);
                }
            }
        }
    });
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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ChatMessageWithProfile {
    pub message_id: ObjectId,
    pub room_id: String,
    pub user_id: String,
    pub date_time: u64,
    pub content: String,
    pub profile_url: String,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ServerMessage {
    Reply(ChatMessageWithProfile),
    PreviousMessages(Vec<ChatMessageWithProfile>),
}
