use derive_more::{Display, Error, From};
use mongodb;

use crate::{database::Notification, routes::chat};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, Error, From, Display)]
pub enum Error {
    MongoDB(mongodb::error::Error),

    Notification(tokio::sync::broadcast::error::SendError<Notification>),

    Chat(tokio::sync::broadcast::error::SendError<chat::ClientMessage>),

    BsonDe(mongodb::bson::de::Error),
    BsonSer(mongodb::bson::ser::Error),
}
