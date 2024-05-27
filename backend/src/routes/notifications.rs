use axum::{
    extract::{Query, State},
    response::IntoResponse,
    Json,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::{SinkExt, StreamExt, TryStreamExt};
use serde_json::json;

use crate::{
    database::{self as db, Notification, NotificationBody, StageIdentifier},
    state::AppState,
    utils::{authenticate_user, AuthenticationStatus},
};

use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, sync::Arc};

pub async fn events(Json(event): Json<db::Event>) -> impl IntoResponse {
    match event {
        db::Event::NewStage { stage, receiver_id } => {}
        db::Event::RolledBackStage { stage, receiver_id } => {}
        db::Event::ReassignedStage { stage, receiver_id } => {}
    }
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

    if let Some(Ok(Message::Item(ClientMessage::Authenticate { session_id }))) =
        ws_receiver.next().await
    {
        tracing::debug!("{}", args.user_id);
        match authenticate_user(&state.database, &session_id, &args.user_id).await {
            Ok(AuthenticationStatus::Authorized) => {
                tracing::debug!("Authenticated!");
            }
            Ok(AuthenticationStatus::Unauthorized) => {
                let _ = ws_sender.send(Message::Close(None)).await;
                tracing::debug!("Client did not authenticate properly");
                return;
            }
            Err(err) => {
                tracing::error!("Error {err}");
                let _ = ws_sender.send(Message::Close(None)).await;
                return;
            }
        };
    } else {
        tracing::error!("Client did not authenticate");
        return;
    }

    match get_unseen_notifications(state.database.clone(), &args.user_id).await {
        Ok(notifications) => {
            let status = ws_sender
                .send(Message::Item(ServerMessage::UnseenNotificationsCount(
                    notifications,
                )))
                .await;

            if let Err(err) = status {
                tracing::error!("{err}");
            }
        }
        Err(err) => {
            tracing::error!("{err}");
            return;
        }
    };

    let _receive_task = tokio::spawn(async move {
        while let Ok(notification) = notification_tx.recv().await {
            let notifications_collection = state
                .database
                .collection::<db::Notification>("notifications");

            // set the notification to be seen
            if notification.user_id == args.user_id {
                let update_result = notifications_collection
                    .update_one(
                        doc! { "_id": notification._id},
                        doc! {"$set": doc! {
                            "seen": true,
                        } },
                        None,
                    )
                    .await;

                if let Err(err) = update_result {
                    tracing::error!("{err}");
                }
            }

            match notification.body {
                NotificationBody::Event(event) => {}
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

                            let users_collection = state.database.collection::<db::User>("users");

                            let user = match users_collection
                                .find_one(doc! {"_id": &message.user_id}, None)
                                .await
                            {
                                Ok(Some(user)) => user,
                                Ok(None) => {
                                    tracing::error!("Invalid user_id `{}`", message.user_id);
                                    continue;
                                }
                                Err(err) => {
                                    tracing::error!("{err}");
                                    continue;
                                }
                            };

                            let server_message = ServerMessage::NewMessage {
                                message,
                                request,
                                from: user,
                            };

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
            NotificationBody::Event(event) => {}
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
                                let identifier = StageIdentifier {
                                    request_id: request._id.clone(),
                                    stage_type_index: request.current_stage.stage_type_index,
                                };

                                let identifier_count =
                                    count.inbox.active.entry(identifier).or_insert(0);
                                *identifier_count += 1;
                            }

                            if current_handler != *user_id {
                                let identifier = StageIdentifier {
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
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ClientMessage {
    #[serde(rename_all = "camelCase")]
    Authenticate { session_id: String },
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum ServerMessage {
    NewMessage {
        message: db::Message,
        request: db::Request,
        from: db::User,
    },

    NewRolledBackStage {
        from: db::User,
        stage_type_index: u64,
        request: db::Request,
    },

    NewReassignedStage {
        from: db::User,
        stage_type_index: u64,
        request: db::Request,
    },

    NewStage {
        from: db::User,
        stage_type_index: u64,
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
    pub active: HashMap<StageIdentifier, u64>,
    #[serde_as(as = "Vec<(_, _)>")]
    pub pending: HashMap<StageIdentifier, u64>,
}

#[derive(Serialize, Deserialize)]
pub struct RequestsCount {}
