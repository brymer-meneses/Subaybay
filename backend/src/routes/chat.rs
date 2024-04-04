use axum::extract::ws::{Message, WebSocket};
use axum::extract::{ConnectInfo, Path, State, WebSocketUpgrade};
use axum::http::StatusCode;
use axum::routing::get;
use axum::{response::IntoResponse, Router};
use mongodb::Collection;
use serde::{Deserialize, Serialize};

use std::net::SocketAddr;
use std::sync::Arc;

use crate::database::{Chat, ChatMessage, ChatMessagePayload, Session, User};

use super::AppState;

pub fn root(state: Arc<AppState>) -> Router<Arc<AppState>> {
    let router = Router::new()
        .route("/:chat_id/ws", get(chat_connect))
        .with_state(state);

    router
}

use mongodb::bson::doc;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct SessionIdParam {
    session_id: String,
}

async fn chat_connect(
    Path(chat_id): Path<String>,
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    // Make sure the room exists

    let chats = state.database.collection::<Chat>("chats");
    let queried_chat = chats
        .find_one(doc! { "chatId": &chat_id }, None)
        .await
        .unwrap();

    if queried_chat.is_none() {
        let status = chats
            .insert_one(
                Chat {
                    chat_id: chat_id.clone(),
                    messages: vec![],
                },
                None,
            )
            .await;

        if status.is_err() {
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        };
    }

    Ok(ws.on_upgrade(move |socket| handle_chat_connection(state, socket, addr, chat_id)))
}

async fn validate_session_id(sessions: Collection<Session>, session_id: &String) -> bool {
    use std::time::SystemTime;

    let session = sessions.find_one(doc! {"_id": session_id}, None).await;
    if let Ok(Some(session)) = session {
        let expires_at = session.expires_at.to_system_time();
        let now = SystemTime::now();

        if expires_at <= now {
            return false;
        }

        return true;
    } else {
        return false;
    }
}

async fn handle_chat_connection(
    state: Arc<AppState>,
    socket: WebSocket,
    addr: SocketAddr,
    chat_id: String,
) {
    use futures::SinkExt;
    use futures::StreamExt;

    let (mut ws_sender, mut ws_receiver) = socket.split();
    let chats = state.database.collection::<Chat>("chats");

    // the first message from the user should be the session_id
    // we then need to validate this to make sure the user is authenticated
    if let Some(Ok(Message::Text(session_id))) = ws_receiver.next().await {
        let sessions = state.database.collection::<Session>("sessions");

        if !validate_session_id(sessions, &session_id).await {
            let _ = ws_sender.send(Message::Close(None)).await;
            return;
        }

        // send in all the messages from the user
        let chats = state.database.collection::<Chat>("chats");
        let queried_chat = chats
            .find_one(doc! { "chatId": &chat_id }, None)
            .await
            .unwrap();

        if let Some(chat) = queried_chat {
            let serialized_message =
                serde_json::to_string(&chat.messages).expect("Failed to serialize");

            let status = ws_sender.send(Message::Text(serialized_message)).await;

            if status.is_err() {
                return;
            }
        }
    } else {
        let _ = ws_sender.send(Message::Close(None)).await;
        return;
    }

    let mut rx = state.tx.subscribe();
    let sender = state.tx.clone();

    let mut send_task = tokio::spawn(async move {
        while let Ok(message_payload) = rx.recv().await {
            let users = state.database.collection::<User>("users");

            let user = users
                .find_one(doc! {"_id": &message_payload.user_id}, None)
                .await;

            if let Ok(Some(user)) = user {
                let message = ChatMessage::Response {
                    date_time: message_payload.date_time,
                    content: message_payload.content.clone(),
                    user_id: message_payload.user_id,
                    profile_url: user.profile_url,
                };

                let content = serde_json::to_string(&message);

                if content.is_err() {
                    break;
                }

                // update to the database
                let filter = doc! { "chatId": &chat_id };
                let update = doc! { "$push": doc! {"messages": &message} };
                let status = chats.update_one(filter, update, None).await;

                if status.is_err() {
                    break;
                }

                if ws_sender
                    .send(Message::Text(content.unwrap()))
                    .await
                    .is_err()
                {
                    break;
                }
            }
        }
    });

    let mut receive_task = tokio::spawn(async move {
        while let Some(Ok(msg)) = ws_receiver.next().await {
            match msg {
                Message::Text(msg) => {
                    let msg = serde_json::from_str::<ChatMessagePayload>(&msg);

                    if let Ok(msg) = msg {
                        // send to all listeners
                        let _ = sender.send(msg);
                    }
                }

                Message::Close(_) => break,

                _ => {}
            };
        }
    });

    // If any one of the tasks run to completion, we abort the other.
    tokio::select! {
        _ = (&mut send_task) => receive_task.abort(),
        _ = (&mut receive_task) => send_task.abort(),
    };

    tracing::info!("Websocket context {addr} destroyed");
}
