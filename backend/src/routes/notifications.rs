use axum::response::IntoResponse;
use axum_extra::extract::cookie::CookieJar;

pub async fn websocket() -> impl IntoResponse {
    println!("Entered notificatiosn web");
}
