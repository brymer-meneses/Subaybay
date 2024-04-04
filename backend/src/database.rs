use mongodb::{bson::doc, Collection};
use serde::{Deserialize, Serialize};
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Chat {
    pub chat_id: String,
    pub messages: Vec<ChatMessage>,
}

/// What the server responds with
#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum ChatMessage {
    #[serde(rename = "response", rename_all = "camelCase")]
    Response {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
        user_id: String,
        profile_url: String,
    },

    #[serde(rename = "event", rename_all = "camelCase")]
    Event {
        #[serde(default = "get_time")]
        date_time: u64,
        content: String,
    },
}

/// What actually gets sent by the user
#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChatMessagePayload {
    #[serde(default = "get_time")]
    pub date_time: u64,
    pub content: String,
    pub user_id: String,
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
    pub expires_at: bson::DateTime,
}

pub fn get_time() -> u64 {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX Epoch"),
    }
}

use mongodb::bson::{self, Bson};

impl From<ChatMessage> for Bson {
    fn from(msg: ChatMessage) -> Self {
        bson::to_document(&msg).unwrap().into()
    }
}
