use axum::{
    http::Method,
    middleware,
    response::IntoResponse,
    routing::{get, post},
    Router,
};

use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};

use crate::{state::AppState, Config};
use std::sync::Arc;

pub mod chat;
pub mod notifications;

use crate::middlewares::authentication;

pub async fn root(config: &Config) -> Router {
    let cors_layer = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let trace_layer = TraceLayer::new_for_http();
    let state = Arc::new(AppState::new(config).await);

    Router::new()
        .route("/notifications/ws", get(notifications::websocket))
        .route("/notifications/events", post(notifications::event))
        .route("/chat/ws", get(chat::websocket))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            authentication,
        ))
        .route("/status", get(status))
        .layer(cors_layer)
        .layer(trace_layer)
        .with_state(state)
}

async fn status() -> impl IntoResponse {
    "Everything okay ..."
}
