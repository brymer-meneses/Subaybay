use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};

use crate::state::AppState;
use std::sync::Arc;

pub async fn websocket(
    State(state): State<Arc<AppState>>,
    Query(args): Query<ConnectionArgs>,
    ws: WebSocketUpgrade<ServerMessage, ClientMessage>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_connection(state, args, socket))
}

async fn handle_connection(
    state: Arc<AppState>,
    args: ConnectionArgs,
    socket: WebSocket<ServerMessage, ClientMessage>,
) {
    use futures::SinkExt;
    use futures::StreamExt;
    use mongodb::{bson::doc, change_stream::event::OperationType};

    let pipeline =
        [doc! { "$match" : doc! { "operationType" : { "$in" : ["insert", "update"] } } }];

    let mut change_stream = state.database.watch(pipeline, None).await.unwrap();

    while let Some(event) = change_stream.next().await.transpose().unwrap() {
        let collection_name = match event.ns {
            Some(ns) => "",
            None => "", // Some(ns) => {
                        // }
                        // None => {
                        //     return "";
                        //     // println!("No namespace found for the event");
                        //     // continue;
                        // }
        };

        match event.operation_type {
            OperationType::Insert => println!("Insert performed: {:?}", event.full_document),
            OperationType::Update => println!("Update performed: {:?}", event.update_description),
            _ => println!("Unknown operation"),
        }
    }
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    user_id: String,
}

#[derive(Serialize, Deserialize)]
pub enum ClientMessage {}

#[derive(Serialize, Deserialize)]
pub enum ServerMessage {}
