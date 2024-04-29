use mongodb::bson::{doc, oid::ObjectId, DateTime};

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Room {
    pub room_id: String,
    pub participants: Vec<String>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    #[serde(default = "ObjectId::new")]
    pub message_id: ObjectId,
    pub room_id: String,
    pub user_id: String,
    pub date_time: u64,
    pub content: String,
}

#[derive(Deserialize, Serialize)]
pub enum Notification {
    Message { message_id: ObjectId },
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(alias = "_id")]
    pub _id: String,
    pub name: String,
    pub email: String,
    pub profile_url: String,
    pub is_admin: bool,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Session {
    #[serde(alias = "_id")]
    pub _id: String,
    pub user_id: String,
    pub expires_at: DateTime,
}
