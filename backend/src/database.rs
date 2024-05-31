use mongodb::bson::{doc, oid::ObjectId, DateTime};

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Message {
    #[serde(rename = "_id")]
    pub _id: ObjectId,
    pub request_id: String,
    pub user_id: String,
    pub date_time: u64,
    pub content: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Notification {
    #[serde(rename = "_id")]
    pub _id: ObjectId,
    pub seen: bool,
    pub user_id: String,
    pub body: NotificationBody,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum NotificationBody {
    #[serde(rename_all = "camelCase")]
    Message { message_id: ObjectId },

    #[serde(rename_all = "camelCase")]
    Event(Event),
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(tag = "type")]
pub enum Event {
    #[serde(rename_all = "camelCase")]
    NewStage {
        stage: StageIdentifier,
        receiver_id: String,
    },

    #[serde(rename_all = "camelCase")]
    RolledBackStage {
        stage: StageIdentifier,
        receiver_id: String,
    },

    #[serde(rename_all = "camelCase")]
    ReassignedStage {
        stage: StageIdentifier,
        receiver_id: String,
    },
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
#[derive(Deserialize, Serialize, Debug, Clone, Hash, Eq, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct StageIdentifier {
    pub request_id: String,
    pub stage_type_index: u64,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    #[serde(alias = "_id")]
    pub _id: String,
    pub request_type_id: String,
    pub student_number: String,
    pub student_name: String,
    pub student_email: String,
    pub purpose: String,
    pub remarks: String,
    pub is_finished: bool,
    pub current_stage: Stage,
    pub history: Vec<Stage>,
    pub next_handler_id: String,
    pub room_id: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RequestType {
    #[serde(alias = "_id")]
    pub _id: String,
    pub title: String,
    pub version: u64,
    pub stages: Vec<StageType>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct StageType {
    pub stage_title: String,
    pub default_handler_id: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Stage {
    pub stage_type_index: u64,
    pub handler_id: String,
    pub prev_handler_id: String,
    pub finished: bool,
    pub date_started: DateTime,
    pub date_finished: DateTime,
}

impl Event {
    pub fn get_receiver_id(&self) -> &str {
        match self {
            Self::NewStage { receiver_id, .. } => receiver_id,
            Self::RolledBackStage { receiver_id, .. } => receiver_id,
            Self::ReassignedStage { receiver_id, .. } => receiver_id,
        }
    }

    pub fn get_stage(&self) -> &StageIdentifier {
        match self {
            Self::NewStage { stage, .. } => stage,
            Self::RolledBackStage { stage, .. } => stage,
            Self::ReassignedStage { stage, .. } => stage,
        }
    }
}
