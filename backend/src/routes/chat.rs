use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::{stream::SplitSink, SinkExt, StreamExt};
use mongodb::bson::oid::ObjectId;

use crate::{
    database as db,
    error::Result,
    state::AppState,
    utils::{authenticate_user, AuthenticationStatus},
};
use mongodb::bson::{self, doc};
use std::sync::Arc;
use tokio::sync::broadcast;

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(args): Query<ConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(Arc::new(args), state, socket))
}

async fn handle_connection(
    connection_args: Arc<ConnectionArgs>,
    state: Arc<AppState>,
    socket: WebSocket<ServerMessage, ClientMessage>,
) {
    let (mut ws_sender, mut ws_receiver) = socket.split();

    if let Some(Ok(Message::Item(ClientMessage::Authenticate { session_id }))) =
        ws_receiver.next().await
    {
        match authenticate_user(&state.database, &session_id, &connection_args.user_id).await {
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

    match get_previous_messages(&connection_args, state.database.clone()).await {
        Ok(messages) => {
            let _ = ws_sender
                .send(Message::Item(ServerMessage::PreviousMessages(messages)))
                .await;
        }

        Err(err) => {
            tracing::error!("Failed to send previous messages: {err}");
        }
    }

    let mut message_tx = state.message_tx.subscribe();
    let sender = state.message_tx.clone();

    let args = connection_args.clone();
    let database = state.database.clone();

    // listens to the broadcasted channels gets the complete information from the database and
    // sends it to the client
    let mut send_task = tokio::spawn(async move {
        while let Ok(message) = message_tx.recv().await {
            if args.request_id != message.request_id {
                continue;
            }

            if let Err(err) = send_server_message(message, &database, &mut ws_sender).await {
                tracing::error!("{err}");
                return;
            }
        }
    });

    let args = connection_args.clone();

    // receives chat payload from the client and stores the message in the database and sendsit
    // through the connected clients over the websocket
    let mut receive_task = tokio::spawn(async move {
        let database = state.database.clone();
        let notification_tx = &state.notification_tx;
        while let Some(message) = ws_receiver.next().await {
            match message {
                Ok(Message::Item(message)) => {
                    if let Err(err) =
                        process_client_message(&args, message, &sender, &database, notification_tx)
                            .await
                    {
                        tracing::error!("{err}");
                        return;
                    }
                }

                Ok(Message::Close(_)) => {
                    tracing::info!("closing socket");
                    return;
                }
                Ok(_) => {
                    tracing::info!("invalid message");
                }

                Err(err) => {
                    tracing::error!("{:?}", err);
                    return;
                }
            }
        }
    });

    // If any one of the tasks run to completion, we abort the other.
    tokio::select! {
        _ = (&mut send_task) => receive_task.abort(),
        _ = (&mut receive_task) => send_task.abort(),
    };
}

async fn send_server_message(
    message: MessageTx,
    database: &mongodb::Database,
    ws_sender: &mut SplitSink<WebSocket<ServerMessage, ClientMessage>, Message<ServerMessage>>,
) -> Result<()> {
    let users = database.collection::<db::User>("users");
    let user = users.find_one(doc! {"_id": &message.user_id}, None).await?;

    match user {
        Some(user) => {
            let _ = ws_sender
                .send(Message::Item(ServerMessage::Reply(MessageWithProfile {
                    date_time: message.date_time,
                    user_id: message.user_id,
                    content: message.content,
                    profile_url: user.profile_url,
                })))
                .await;
        }
        None => {
            tracing::error!("Got an invalid user_id `{}`", &message.user_id);
        }
    };

    Ok(())
}

async fn process_client_message(
    args: &Arc<ConnectionArgs>,
    message: ClientMessage,
    sender: &broadcast::Sender<MessageTx>,
    database: &mongodb::Database,
    notification_tx: &broadcast::Sender<db::Notification>,
) -> Result<()> {
    match message {
        ClientMessage::Message { content, user_id } => {
            let date_time = get_time();
            // we store the mesage here since if we do it in `send_task` it will be
            // duplicated by other threads
            let chat_message = db::Message {
                _id: ObjectId::new(),
                user_id,
                request_id: args.request_id.clone(),
                date_time,
                content,
            };

            database
                .collection::<db::Message>("messages")
                .insert_one(&chat_message, None)
                .await?;

            process_notifications(database, &chat_message, notification_tx).await?;

            sender.send(MessageTx {
                date_time,
                content: chat_message.content,
                user_id: chat_message.user_id,
                request_id: chat_message.request_id,
            })?;
        }

        ClientMessage::Authenticate { .. } => {}

        ClientMessage::Event {
            date_time: _,
            content: _,
        } => {}
    }

    Ok(())
}

async fn process_notifications(
    database: &mongodb::Database,
    message: &db::Message,
    sender: &broadcast::Sender<db::Notification>,
) -> Result<()> {
    let notifications_collection = database.collection::<db::Notification>("notifications");
    let requests_collection = database.collection::<db::Request>("requests");
    let request = requests_collection
        .find_one(doc! { "_id": &message.request_id}, None)
        .await?;

    let send_notification = |handler_id: String| async {
        if handler_id == message.user_id || handler_id.is_empty() {
            return crate::error::Result::Ok(());
        }

        let notification = db::Notification {
            _id: ObjectId::new(),
            seen: false,
            body: db::NotificationBody::Message {
                message_id: message._id,
            },
            user_id: handler_id,
        };

        notifications_collection
            .insert_one(&notification, None)
            .await?;

        if sender.send(notification).is_err() {
            tracing::error!("No channel to send notifications");
        }

        Ok(())
    };

    match request {
        Some(request) => {
            let previous_handler = request.current_stage.prev_handler_id;
            let current_handler = request.current_stage.handler_id;

            send_notification(previous_handler).await?;
            send_notification(current_handler).await?;
        }

        None => {
            tracing::error!("Invalid request._id: {}", message.request_id);
        }
    }

    Ok(())
}

async fn get_previous_messages(
    params: &ConnectionArgs,
    database: mongodb::Database,
) -> Result<Vec<MessageWithProfile>> {
    let messages_collection = database.collection::<db::Message>("messages");

    let pipeline = vec![
        doc! {
            "$match": {
                "requestId": &params.request_id,
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
                "requestId": 1,
                "userId": 1,
                "content": 1,
                "dateTime": 1,
                "profileUrl": "$userInfo.profileUrl"
            }
        },
    ];

    let mut cursor = messages_collection.aggregate(pipeline, None).await?;
    let mut messages = Vec::new();

    while let Some(doc) = cursor.next().await.transpose()? {
        let chat_message: MessageWithProfile = bson::from_document(doc)?;
        messages.push(chat_message);
    }

    Ok(messages)
}

use crate::utils::get_time;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    request_id: String,
    user_id: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(tag = "type", content = "content", rename_all = "camelCase")]
pub enum ClientMessage {
    #[serde(rename_all = "camelCase")]
    Message { content: String, user_id: String },

    #[serde(rename_all = "camelCase")]
    Event {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
    },

    #[serde(rename_all = "camelCase")]
    Authenticate { session_id: String },
}

// an internal data structure that gets shared between threads
#[derive(Debug, Clone)]
pub struct MessageTx {
    date_time: u64,
    content: String,
    request_id: String,
    user_id: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct MessageWithProfile {
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
