use axum::{
    extract::{Query, State},
    response::IntoResponse,
};

use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};

use futures::TryStreamExt;
use mongodb::bson::{self, doc};
use serde::{Deserialize, Serialize};

use crate::database as db;
use crate::state::AppState;
use std::sync::Arc;

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(param): Query<ChatConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(state, socket, param))
}

async fn handle_connection(
    state: Arc<AppState>,
    socket: WebSocket<ServerMessage, ClientMessage>,
    params: ChatConnectionArgs,
) {
    use futures::SinkExt;
    use futures::StreamExt;

    let (mut sender, mut receiver) = socket.split();

    let messages_collection = state.database.collection::<db::ChatMessage>("chatMessages");
    let pipeline = vec![
        doc! {
            "$lookup": {
                "from": "users",
                "localField": "user_id",
                "foreignField": "_id",
                "as": "user_info"
            }
        },
        doc! {
            "$unwind": "$user_info"
        },
        doc! {
            "$project": {
                "chat_id": 1,
                "user_id": 1,
                "content": 1,
                "time": 1,
                "profile_url": "$user_info.profile_url"
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

use crate::utils::get_time;

#[derive(Serialize, Deserialize)]
pub struct ChatConnectionArgs {
    chat_id: String,
    user_id: String,
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum ClientMessage {
    #[serde(rename = "response", rename_all = "camelCase")]
    Response {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
        user_id: String,
    },

    #[serde(rename = "event", rename_all = "camelCase")]
    Event {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
    },
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ChatMessageWithProfile {
    pub chat_id: String,
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
