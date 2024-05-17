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
use mongodb::bson::doc;
use std::{collections::HashMap, sync::Arc};

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

async fn handle_connection(
    state: Arc<AppState>,
    args: ConnectionArgs,
    socket: WebSocket<ServerMessage, ClientMessage>,
) {
    let (mut ws_sender, mut ws_receiver) = socket.split();

    let mut notification_tx = state.notification_tx.subscribe();

    match get_unseen_notifications(state.database.clone(), &args.user_id).await {
        Ok(notifications) => {
            // TODO: process this and send to the user
        }
        Err(err) => {
            tracing::error!("{err}");
        }
    };

    let receive_task = tokio::spawn(async move {
        while let Ok(notification) = notification_tx.recv().await {
            let notifications_collection = state
                .database
                .collection::<db::Notification>("notifications");

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

            match notification.body {
                NotificationBody::Message { message_id } => {
                    let message_collection = state.database.collection::<db::Message>("messages");
                    let message = message_collection
                        .find_one(doc! {"_id": message_id}, None)
                        .await
                        .ok()
                        .flatten();

                    if let Some(message) = message {
                        if message.user_id == args.user_id {
                            continue;
                        }

                        let _ = ws_sender
                            .send(Message::Item(ServerMessage::NewMessage(message)))
                            .await;
                    } else {
                        tracing::error!("Failed to get the message_id: `{}`", message_id);
                    }
                }
            }
            // ws_sender.send(Message::Item(ServerMessage::NewMessage()))
        }
    });
}

async fn get_unseen_notifications(
    database: mongodb::Database,
    user_id: &String,
) -> mongodb::error::Result<Vec<Notification>> {
    let notifications_collection = database.collection::<db::Notification>("notifications");

    notifications_collection
        .find(
            doc! {
                "userId": user_id,
                "seen": false,
            },
            None,
        )
        .await?
        .try_collect::<Vec<Notification>>()
        .await
}

use serde::{Deserialize, Serialize};

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
    NewMessage(db::Message),
    NewInboxItem(db::InboxItemIdentifier),

    #[serde(rename_all = "camelCase")]
    UnseenNotificationsCount(NotificationsCount),
}

#[derive(Serialize, Deserialize)]
pub struct NotificationsCount {
    inbox: InboxCount,
    requests: RequestsCount,
}

#[derive(Serialize, Deserialize)]
pub struct InboxCount {
    active: Vec<(InboxItemIdentifier, u64)>,
    pending: Vec<(InboxItemIdentifier, u64)>,
}

#[derive(Serialize, Deserialize)]
pub struct RequestsCount {}
