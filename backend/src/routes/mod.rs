use axum::{
    http::Method,
    middleware,
    response::{IntoResponse, Redirect},
    routing::get,
    Router,
};

use tower::{Layer, ServiceBuilder};
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;

use crate::state::AppState;
use std::sync::Arc;

mod chat;
mod notifications;

use crate::middlewares::authentication;

pub async fn root() -> Router {
    let cors_layer = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(Any);

    let trace_layer = TraceLayer::new_for_http();
    let state = Arc::new(AppState::new().await);

    let router = Router::new()
        .route("/notifications/ws", get(notifications::websocket))
        .route("/chat/ws", get(chat::websocket))
        .route_layer(ServiceBuilder::new().layer(middleware::from_fn_with_state(
            state.clone(),
            authentication,
        )))
        .route("/status", get(status))
        .layer(cors_layer)
        .layer(trace_layer)
        .with_state(state);

    router
}

async fn status() -> impl IntoResponse {
    "Everything okay ..."
}
