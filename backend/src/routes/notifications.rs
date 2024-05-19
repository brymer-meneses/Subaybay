use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::{SinkExt, StreamExt, TryStreamExt};

use crate::state::AppState;
use crate::{
    database::{self as db, InboxItemIdentifier, Notification, NotificationBody},
    error::Result,
};

use mongodb::bson::{doc, oid::ObjectId};
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc, thread::current};

pub async fn event() -> impl IntoResponse {
    "ok"
}

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(args): Query<ConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(state, args, socket))
}
//
async fn handle_connection(
    state: Arc<AppState>,
    args: ConnectionArgs,
    socket: WebSocket<ServerMessage, ClientMessage>,
) {
    let (mut ws_sender, mut ws_receiver) = socket.split();
    let mut notification_tx = state.notification_tx.subscribe();

    match get_unseen_notifications(state.database.clone(), &args.user_id).await {
        Ok(notifications) => {
            let status = ws_sender
                .send(Message::Item(ServerMessage::UnseenNotificationsCount(
                    notifications,
                )))
                .await;
        }
        Err(err) => {
            tracing::error!("{err}");
            return;
        }
    };

    let receive_task = tokio::spawn(async move {
        while let Ok(notification) = notification_tx.recv().await {
            let notifications_collection = state
                .database
                .collection::<db::Notification>("notifications");

            // set the notification to be seen
            // if notification.user_id == args.user_id {
            //     let update_result = notifications_collection
            //         .update_one(
            //             doc! { "_id": notification._id},
            //             doc! {"$set": doc! {
            //                 "seen": true,
            //             } },
            //             None,
            //         )
            //         .await;
            //
            //     if let Err(err) = update_result {
            //         tracing::error!("{err}");
            //     }
            // }

            match notification.body {
                NotificationBody::Message { message_id } => {
                    let message_collection = state.database.collection::<db::Message>("messages");
                    let message = message_collection
                        .find_one(doc! {"_id": message_id}, None)
                        .await
                        .ok()
                        .flatten();

                    match message {
                        Some(message) => {
                            if message.user_id == args.user_id {
                                continue;
                            }

                            let requests_collection =
                                state.database.collection::<db::Request>("requests");

                            let request = match requests_collection
                                .find_one(doc! {"_id": &message.request_id}, None)
                                .await
                            {
                                Ok(Some(request)) => request,
                                Ok(None) => {
                                    tracing::error!("Invalid request_id `{}`", message.request_id);
                                    continue;
                                }
                                Err(err) => {
                                    tracing::error!("{err}");
                                    continue;
                                }
                            };

                            let server_message = ServerMessage::NewMessage { message, request };

                            let _ = ws_sender.send(Message::Item(server_message)).await;
                        }
                        None => {
                            tracing::error!("Failed to get the message_id: `{}`", message_id);
                        }
                    }
                }
            }
        }
    });
}

async fn get_unseen_notifications(
    database: mongodb::Database,
    user_id: &String,
) -> mongodb::error::Result<NotificationsCount> {
    let notifications_collection = database.collection::<db::Notification>("notifications");
    let notifications = notifications_collection
        .find(
            doc! {
                "userId": user_id,
                "seen": false,
            },
            None,
        )
        .await?
        .try_collect::<Vec<Notification>>()
        .await?;

    let requests_collection = database.collection::<db::Request>("requests");
    let messages_collection = database.collection::<db::Message>("messages");

    let mut count = NotificationsCount {
        inbox: InboxCount {
            active: HashMap::new(),
            pending: HashMap::new(),
        },
    };

    for notification in notifications {
        match notification.body {
            NotificationBody::Message { message_id } => {
                let message = messages_collection
                    .find_one(doc! {"_id": &message_id}, None)
                    .await?;

                match message {
                    Some(message) => {
                        let request = requests_collection
                            .find_one(doc! {"_id": message.request_id}, None)
                            .await?;

                        if let Some(request) = request {
                            let previous_handler = request.current_stage.prev_handler_id;
                            let current_handler = request.current_stage.handler_id;

                            if previous_handler != *user_id {
                                let identifier = InboxItemIdentifier {
                                    request_id: request._id.clone(),
                                    stage_type_index: request.current_stage.stage_type_index,
                                };

                                let identifier_count =
                                    count.inbox.active.entry(identifier).or_insert(0);
                                *identifier_count += 1;
                            }

                            if current_handler != *user_id {
                                let identifier = InboxItemIdentifier {
                                    request_id: request._id,
                                    stage_type_index: request.current_stage.stage_type_index,
                                };

                                let identifier_count =
                                    count.inbox.pending.entry(identifier).or_insert(0);
                                *identifier_count += 1;
                            }
                        }
                    }

                    None => {
                        tracing::error!("Cannot find message_id: {message_id}");
                        continue;
                    }
                };
            }
        }
    }

    Ok(count)
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    user_id: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub enum ClientMessage {}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum ServerMessage {
    NewMessage {
        message: db::Message,
        request: db::Request,
    },

    NewInboxItem {
        request: db::Request,
    },

    UnseenNotificationsCount(NotificationsCount),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NotificationsCount {
    pub inbox: InboxCount,
}

use serde_with::serde_as;

#[serde_as]
#[derive(Serialize, Deserialize, Debug)]
pub struct InboxCount {
    #[serde_as(as = "Vec<(_, _)>")]
    pub active: HashMap<InboxItemIdentifier, u64>,
    #[serde_as(as = "Vec<(_, _)>")]
    pub pending: HashMap<InboxItemIdentifier, u64>,
}

#[derive(Serialize, Deserialize)]
pub struct RequestsCount {}
