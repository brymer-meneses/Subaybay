use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::TryStreamExt;

use crate::{database as db, state::AppState};
use std::sync::Arc;

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(args): Query<ConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(state, args, socket))
}

async fn handle_connection(
    state: Arc<AppState>,
    args: ConnectionArgs,
    socket: WebSocket<ServerMessage, ClientMessage>,
) {
    use futures::SinkExt;
    use futures::StreamExt;
    use mongodb::{
        bson::{self, doc},
        change_stream::event::OperationType,
    };

    let pipeline =
        [doc! { "$match" : doc! { "operationType" : { "$in" : ["insert", "update"] } } }];

    let mut change_stream = state.database.watch(pipeline, None).await.unwrap();
    let notifications_col = state
        .database
        .collection::<db::Notification>("notifications");
    let messages_col = state.database.collection::<db::Message>("messages");

    let notifications = notifications_col
        .find(
            doc! {"content": {
                "userId": &args.user_id,
                "seen": false,
            }},
            None,
        )
        .await
        .unwrap()
        .try_collect::<Vec<db::Notification>>()
        .await
        .unwrap();

    struct Count {
        messages: u16,
        requests: u16,
    }

    let notifications_count = notifications.iter().fold(
        Count {
            messages: 0,
            requests: 0,
        },
        |mut acc, elem| {
            match elem {
                db::Notification::Message { .. } => {
                    acc.messages += 1;
                }
            }
            acc
        },
    );

    let (mut sender, mut receiver) = socket.split();

    let _ = sender
        .send(Message::Item(ServerMessage::UnseenNotificationsCount {
            messages: notifications_count.messages,
            requests: notifications_count.requests,
        }))
        .await;

    let notifs = notifications_col.clone();

    // receives new notifications and sends them
    tokio::spawn(async move {
        let pipeline = [doc! { "$match" : doc! { "operationType" : "insert" } }];

        let mut change_stream = notifs.watch(pipeline, None).await.unwrap();

        while let Some(event) = change_stream.next().await.transpose().unwrap() {
            match event.operation_type {
                OperationType::Insert => {
                    let notification = event.full_document.unwrap();
                    match notification {
                        db::Notification::Message {
                            message_id,
                            user_id,
                            ..
                        } => {
                            if user_id == args.user_id {
                                let message = messages_col
                                    .find_one(doc! {"_id": &message_id}, None)
                                    .await
                                    .unwrap()
                                    .unwrap();
                                let _ = sender
                                    .send(Message::Item(ServerMessage::NewMessage(message)))
                                    .await;
                            }
                        }
                    }
                }
                _ => {}
            }
        }
    });

    // writes new notifications
    tokio::spawn(async move {
        while let Some(event) = change_stream.next().await.transpose().unwrap() {
            let collection_name = match event.ns {
                Some(ref ns) => &ns.coll,
                None => &None,
            };

            if let Some(name) = collection_name {
                match event.operation_type {
                    OperationType::Insert => match name.as_str() {
                        "messages" => {
                            let message =
                                bson::from_document::<db::Message>(event.full_document.unwrap())
                                    .unwrap();

                            let rooms_col = state.database.collection::<db::Room>("rooms");
                            let room = rooms_col
                                .find_one(doc! {"_id": &message.room_id}, None)
                                .await
                                .unwrap()
                                .unwrap();

                            // create a notification for each room participant
                            let notifications =
                                room.participants
                                    .iter()
                                    .map(|user_id| db::Notification::Message {
                                        message_id: message._id,
                                        seen: false,
                                        user_id: user_id.to_string(),
                                    });
                            let _ = notifications_col.insert_many(notifications, None).await;
                        }
                        _ => {}
                    },
                    _ => println!("Unknown operation"),
                }
            }
        }
    });
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    user_id: String,
}

#[derive(Serialize, Deserialize)]
pub enum ClientMessage {}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum ServerMessage {
    NewMessage(db::Message),

    #[serde(rename_all = "camelCase")]
    UnseenNotificationsCount {
        messages: u16,
        requests: u16,
    },
}
