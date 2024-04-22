use mongodb::bson::{doc, DateTime};

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChatRoom {
    pub chat_id: String,
    pub participants: Vec<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChatMessage {
    pub chat_id: String,
    pub user_id: String,
    pub content: String,
    pub date_time: u64,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(alias = "_id")]
    pub id: String,
    pub name: String,
    pub email: String,
    pub profile_url: String,
    pub is_admin: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Session {
    #[serde(alias = "_id")]
    pub id: String,
    pub user_id: String,
    pub expires_at: DateTime,
}

#[derive(Deserialize, Serialize)]
pub enum Notification {
    Message { message_id: String },
}
