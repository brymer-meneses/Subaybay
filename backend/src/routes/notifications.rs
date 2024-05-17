use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::{StreamExt, TryStreamExt};

use crate::{database::InboxItemIdentifier, error::Result};
use crate::{
    database::{self as db, Notification},
    state::AppState,
};
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
    NotificationsCount(NotificationsCount),
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
