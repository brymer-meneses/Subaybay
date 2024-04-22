use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};

use crate::state::AppState;
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
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    user_id: String,
}

pub enum ClientMessage {}
pub enum ServerMessage {}
