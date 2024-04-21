use axum::extract::FromRef;
use mongodb::Database;

#[derive(Clone)]
pub struct AppState {
    pub database: Database,
}

impl AppState {
    pub async fn new() -> Self {
        use mongodb::{
            options::{ClientOptions, ServerApi, ServerApiVersion},
            Client,
        };

        let host = std::env::var("DATABASE_HOSTNAME").unwrap_or("localhost".to_owned());
        let uri = format!("mongodb://{host}:27017");

        let client = {
            let mut options = ClientOptions::parse_async(uri).await.expect("Invalid URI");
            options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());
            Client::with_options(options).expect("Failed to create client")
        };

        let database = client.database("subaybay");

        Self { database }
    }
}
