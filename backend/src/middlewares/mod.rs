use axum::{
    extract::{Query, Request, State},
    http::StatusCode,
    middleware::Next,
    response::Response,
    BoxError,
};

use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::{database::Session, state::AppState};
use mongodb::bson::doc;

#[derive(Serialize, Deserialize)]
pub struct AuthParam {
    session_id: String,
}

pub async fn authentication(
    State(state): State<Arc<AppState>>,
    Query(AuthParam { session_id }): Query<AuthParam>,
    request: Request,
    next: Next,
) -> Result<Response, (StatusCode, &'static str)> {
    use std::time::SystemTime;

    let sessions = state.database.collection::<Session>("sessions");
    let session = sessions
        .find_one(doc! {"_id": session_id.to_string()}, None)
        .await;

    if let Ok(Some(session)) = session {
        let expires_at = session.expires_at.to_system_time();
        let now = SystemTime::now();

        if expires_at <= now {
            return Err((
                StatusCode::UNAUTHORIZED,
                "The `session_id` passed is not valid",
            ));
        }

        let response = next.run(request).await;
        return Ok(response);
    };

    println!("UNAUTHORIZED");
    return Err((
        StatusCode::UNAUTHORIZED,
        "The `session_id` passed is not valid",
    ));
}
