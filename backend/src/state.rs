use crate::{database as db, routes::chat};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use mongodb::Database;
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct AppState {
    pub database: Database,
    pub message_tx: broadcast::Sender<chat::ClientMessage>,
}

impl AppState {
    pub async fn new() -> Self {
        use mongodb::{
            options::{ClientOptions, ServerApi, ServerApiVersion},
            Client,
        };

        let host = std::env::var("DATABASE_HOSTNAME").unwrap_or("localhost".to_owned());
        let uri = format!("mongodb://{host}:27017/?directConnection=true");

        let client = {
            let mut options = ClientOptions::parse_async(uri).await.expect("Invalid URI");
            options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());
            Client::with_options(options).expect("Failed to create client")
        };

        let database = client.database("subaybay");
        let (message_tx, _) = broadcast::channel(128);
        // let (notification_tx, _) = broadcast::channel(128);

        Self {
            database,
            message_tx,
        }
    }
}
