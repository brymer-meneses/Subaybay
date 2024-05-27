use axum::{
    extract::{Request, State},
    http::{header::HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};

use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{
    state::AppState,
    utils::{authenticate_user, AuthenticationStatus},
};
use mongodb::bson::doc;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AuthParam {
    session_id: String,
    user_id: String,
}

pub async fn authentication(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    request: Request,
    next: Next,
) -> Result<Response, (StatusCode, &'static str)> {
    let session_id = headers.get("sessionId").map(|v| v.to_str().ok()).flatten();
    let user_id = headers.get("userId").map(|v| v.to_str().ok()).flatten();

    match (user_id, session_id) {
        (Some(user_id), Some(session_id)) => {
            match authenticate_user(&state.database, session_id, user_id).await {
                Ok(AuthenticationStatus::Unauthorized) => {
                    tracing::debug!("Unauthorized");
                    return Err((StatusCode::UNAUTHORIZED, "Unauthorized"));
                }

                Ok(AuthenticationStatus::Authorized) => {
                    let response = next.run(request).await;
                    return Ok(response);
                }

                Err(err) => {
                    tracing::error!("{err}");
                    return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal server error"));
                }
            }
        }

        _ => {
            return Err((StatusCode::UNAUTHORIZED, "Unauthorized"));
        }
    }
}
