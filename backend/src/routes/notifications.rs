use axum::{
    extract::{Query, State},
    response::IntoResponse,
};
use axum_typed_websockets::{Message, WebSocket, WebSocketUpgrade};
use futures::TryStreamExt;

use crate::error::Result;
use crate::{
    database::{self as db, Notification},
    state::AppState,
};
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
    // use futures::SinkExt;
    // use futures::StreamExt;
    // use mongodb::{
    //     bson::{self, doc},
    //     change_stream::event::OperationType,
    // };
    //
    // let pipeline =
    //     [doc! { "$match" : doc! { "operationType" : { "$in" : ["insert", "update"] } } }];
    //
    // let mut change_stream = state.database.watch(pipeline, None).await.unwrap();
    //
    // let (mut sender, mut receiver) = socket.split();
    // let messages_col = state.database.collection::<db::Message>("messages");
    //
    // if let Ok(context) = get_all_notification_count(&args.user_id, state.database.clone()).await {
    //     let _ = sender
    //         .send(Message::Item(ServerMessage::UnseenNotificationsCount(
    //             context,
    //         )))
    //         .await;
    // }
    //
    // let notifications_col = state.database.collection::<Notification>("notifications");
    // let ws_user_id = args.user_id.clone();
    //
    // // watches new inserts to the database and creates new notifications
    // // these changes are watched by the thread below
    // tokio::spawn(async move {
    //     let pipeline = [doc! { "$match" : doc! { "operationType" : "insert" } }];
    //
    //     let mut change_stream = notifications_col.watch(pipeline, None).await.unwrap();
    //
    //     while let Some(event) = change_stream.next().await.transpose().unwrap() {
    //         match event.operation_type {
    //             OperationType::Insert => {
    //                 let notification = event.full_document.unwrap();
    //                 match notification {
    //                     db::Notification::Message {
    //                         message_id,
    //                         user_id,
    //                         ..
    //                     } => {
    //                         let message = messages_col
    //                             .find_one(doc! {"_id": &message_id}, None)
    //                             .await
    //                             .unwrap()
    //                             .unwrap();
    //
    //                         println!("Sending notification to the client");
    //                         let _ = sender
    //                             .send(Message::Item(ServerMessage::NewMessage(message)))
    //                             .await;
    //                     }
    //                 }
    //             }
    //             _ => {}
    //         }
    //     }
    // });
    //
    // let notifications_col = state.database.collection::<Notification>("notifications");
    //
    // // writes new notifications
    // tokio::spawn(async move {
    //     while let Some(event) = change_stream.next().await.transpose().unwrap() {
    //         let collection_name = match event.ns {
    //             Some(ref ns) => &ns.coll,
    //             None => &None,
    //         };
    //
    //         if let Some(name) = collection_name {
    //             match event.operation_type {
    //                 OperationType::Insert => match name.as_str() {
    //                     "messages" => {
    //                         let message =
    //                             bson::from_document::<db::Message>(event.full_document.unwrap())
    //                                 .unwrap();
    //
    //                         let rooms_col = state.database.collection::<db::Room>("rooms");
    //                         let room = rooms_col
    //                             .find_one(doc! {"roomId": &message.room_id}, None)
    //                             .await
    //                             .unwrap()
    //                             .unwrap();
    //
    //                         // create a notification for each room participant
    //                         let notifications: Vec<db::Notification> = room
    //                             .participants
    //                             .iter()
    //                             .map(|user_id| db::Notification::Message {
    //                                 message_id: message._id,
    //                                 seen: false,
    //                                 user_id: user_id.to_string(),
    //                             })
    //                             .filter(|notification| {
    //                                 let db::Notification::Message { user_id, .. } = notification;
    //                                 return args.user_id != *user_id;
    //                             })
    //                             .collect();
    //
    //                         println!("Inserting notifications to do db \n{:?}", notifications);
    //                         let _ = notifications_col.insert_many(notifications, None).await;
    //                     }
    //                     _ => {}
    //                 },
    //                 _ => println!("Unknown operation"),
    //             }
    //         }
    //     }
    // });
}

async fn get_all_notification_count(user_id: &str, database: mongodb::Database) -> Result<Count> {
    use mongodb::bson::doc;

    let notifications_col = database.collection::<db::Notification>("notifications");

    let notifications = notifications_col
        .find(
            doc! {
                "content.userId": user_id,
                "content.seen": false
            },
            None,
        )
        .await
        .unwrap()
        .try_collect::<Vec<db::Notification>>()
        .await
        .unwrap();

    let notifications_count = notifications.iter().fold(
        Count {
            messages: 0,
            requests: 0,
        },
        |mut acc, elem| {
            match elem {
                db::Notification::Message { .. } => {
                    acc.messages += 1;
                }
            }
            acc
        },
    );

    Ok(notifications_count)
}

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ConnectionArgs {
    user_id: String,
}

#[derive(Serialize, Deserialize)]
pub enum ClientMessage {}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", tag = "type", content = "content")]
pub enum ServerMessage {
    NewMessage(db::Message),

    #[serde(rename_all = "camelCase")]
    UnseenNotificationsCount(Count),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Count {
    messages: u16,
    requests: u16,
}
