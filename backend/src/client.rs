use serde;

use mongodb::bson::{self, Bson};

use std::time::{SystemTime, UNIX_EPOCH};

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    #[serde(default = "get_time")]
    pub date: u64,
    pub content: String,
    pub from: String,
}

#[derive(serde::Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RoomQuery {
    pub room_id: String,
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Room {
    pub room_id: String,
    pub messages: Vec<Message>,
}

pub fn get_time() -> u64 {
    match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX Epoch"),
    }
}
impl From<Message> for Bson {
    fn from(msg: Message) -> Self {
        bson::to_document(&msg).unwrap().into()
    }
}
