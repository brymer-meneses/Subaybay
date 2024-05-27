use std::time::{SystemTime, UNIX_EPOCH};

use crate::database::Session;
use mongodb::bson::doc;

pub fn get_time() -> u64 {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX Epoch"),
    }
}

#[derive(Debug)]
pub enum AuthenticationStatus {
    Authorized,
    Unauthorized,
}

pub async fn authenticate_user(
    database: &mongodb::Database,
    session_id: &str,
    user_id: &str,
) -> mongodb::error::Result<AuthenticationStatus> {
    let sessions = database.collection::<Session>("sessions");
    let session = sessions.find_one(doc! {"_id": &session_id}, None).await?;

    match session {
        Some(session) => {
            let expires_at = session.expires_at.to_system_time();
            let now = SystemTime::now();

            if expires_at <= now {
                return Ok(AuthenticationStatus::Unauthorized);
            }

            if user_id != session.user_id {
                return Ok(AuthenticationStatus::Unauthorized);
            }

            Ok(AuthenticationStatus::Authorized)
        }

        None => Ok(AuthenticationStatus::Unauthorized),
    }
}
