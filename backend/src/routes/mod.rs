use axum::http::Method;
use axum::response::{IntoResponse, Redirect};
use axum::routing::get;
use axum::Router;

use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

use mongodb::Database;

use std::sync::Arc;
use tokio::sync::broadcast;

use crate::database::ChatMessagePayload;

mod chat;

pub async fn root() -> Router {
    let cors_layer = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let trace_layer = TraceLayer::new_for_http();
    let app_state = Arc::new(AppState::new().await);

    let chat_rout = chat::root(app_state.clone());

    let router = Router::new()
        .nest("/chat", chat_rout)
        .route("/status", get(status))
        .route("/", get(|| async { Redirect::permanent("/status") }))
        .layer(cors_layer)
        .layer(trace_layer)
        .with_state(app_state);

    router
}

async fn status() -> impl IntoResponse {
    "Everything okay ..."
}

#[derive(Clone)]
pub struct AppState {
    pub database: Database,
    pub tx: broadcast::Sender<ChatMessagePayload>,
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

        let (tx, _) = broadcast::channel(128);

        Self { database, tx }
    }
}
