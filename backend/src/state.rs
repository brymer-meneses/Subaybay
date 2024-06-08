use crate::{database as db, routes::chat, Config};

use mongodb::Database;
use tokio::sync::broadcast;

#[derive(Clone)]
pub struct AppState {
    pub database: Database,
    pub message_tx: broadcast::Sender<chat::MessageTx>,
    pub notification_tx: broadcast::Sender<db::Notification>,
}

impl AppState {
    pub async fn new(config: &Config) -> Self {
        use mongodb::{
            options::{ClientOptions, ServerApi, ServerApiVersion},
            Client,
        };

        let uri = format!(
            "mongodb://{}:{}@{}:{}/",
            config.database_username,
            config.database_password,
            config.database_hostname,
            config.database_port
        );

        let client = {
            let mut options = ClientOptions::parse_async(uri).await.expect("Invalid URI");
            options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());
            Client::with_options(options).expect("Failed to create client")
        };

        let database = client.database("subaybay");
        let (message_tx, _) = broadcast::channel(128);
        let (notification_tx, _) = broadcast::channel(128);
        // let (notification_tx, _) = broadcast::channel(128);

        Self {
            database,
            message_tx,
            notification_tx,
        }
    }
}
