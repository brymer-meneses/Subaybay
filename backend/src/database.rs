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
    #[serde(default = "ObjectId::new", rename = "_id")]
    pub _id: ObjectId,
    pub room_id: String,
    pub user_id: String,
    pub date_time: u64,
    pub content: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum Notification {
    #[serde(rename_all = "camelCase")]
    PendingInboxItemMessage {
        message_id: ObjectId,
        user_id: String,
    },

    #[serde(rename_all = "camelCase")]
    ActiveInboxItemMessage {
        message_id: ObjectId,
        user_id: String,
    },

    #[serde(rename_all = "camelCase")]
    ActiveInboxItem(InboxItemIdentifier),

    #[serde(rename_all = "camelCase")]
    PendingInboxItem(InboxItemIdentifier),

    #[serde(rename_all = "camelCase")]
    RecalledInboxItem(InboxItemIdentifier),
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    #[serde(rename = "_id")]
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

/// What is needed to query the inbox
#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct InboxItemIdentifier {
    #[serde(alias = "_id")]
    pub _id: ObjectId,
    pub stage_type_index: u64,
}
