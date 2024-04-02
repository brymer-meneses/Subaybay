use std::net::SocketAddr;
use std::sync::Arc;

use axum::extract::ws;
use axum::extract::{ConnectInfo, Query, State, WebSocketUpgrade};
use axum::http::Method;
use axum::{response::IntoResponse, routing, Json, Router};
use mongodb::{Collection, Database};
use serde_json;
use tokio::sync::broadcast::{self, Sender};

use futures::{SinkExt, StreamExt};

use mongodb::{
    bson::doc,
    options::{ClientOptions, ServerApi, ServerApiVersion},
    Client,
};

use tokio;
use tower_http::cors::{self, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing;
use tracing_subscriber;

mod client;

async fn initialize_client() -> Client {
    let host = std::env::var("DATABASE_HOSTNAME").unwrap_or("localhost".to_owned());
    let uri = format!("mongodb://{host}:27017");

    let client = {
        let mut options = ClientOptions::parse_async(uri).await.expect("Invalid URI");
        options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());
        Client::with_options(options).expect("Failed to create client")
    };
    client
}

struct AppState {
    database: Database,
    stream: Sender<client::Message>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let database = initialize_client().await.database("subaybay");

    let (sender, _) = broadcast::channel::<client::Message>(100);

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_origin(cors::Any);

    let app_state = Arc::new(AppState {
        database,
        stream: sender,
    });

    let app = Router::new()
        .route("/", routing::get(root))
        .route("/chat/messages", routing::get(messages))
        .route("/chat/ws", routing::get(ws_handler))
        .with_state(app_state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();

    tracing::info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}

async fn root() -> impl IntoResponse {
    return "Hello there";
}

async fn ws_handler(
    ws: WebSocketUpgrade,
    Query(room_query): Query<client::RoomQuery>,
    State(state): State<Arc<AppState>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    let room_id = room_query.room_id;

    ws.on_upgrade(move |socket| handle_socket(socket, addr, room_id, state))
}

async fn handle_socket(
    socket: ws::WebSocket,
    who: SocketAddr,
    room_id: String,
    state: Arc<AppState>,
) {
    let (mut ws_sender, mut ws_receiver) = socket.split();
    let rooms_collection = state.database.collection::<client::Room>("rooms");

    let mut stream = state.stream.subscribe();

    tokio::spawn(async move {
        while let Ok(msg) = stream.recv().await {
            // In any websocket error, break loop.
            let content = serde_json::to_string(&msg).unwrap();
            if ws_sender.send(ws::Message::Text(content)).await.is_err() {
                break;
            }
        }
    });

    let sender = state.stream.clone();

    tokio::spawn(async move {
        while let Some(Ok(msg)) = ws_receiver.next().await {
            match msg {
                ws::Message::Text(msg) => {
                    let msg = serde_json::from_str::<client::Message>(&msg);
                    if let Ok(msg) = msg {
                        // update to database
                        let filter = doc! { "roomId": &room_id };
                        let update = doc! { "$push": doc! {"messages": &msg}};
                        rooms_collection
                            .update_one(filter, update, None)
                            .await
                            .unwrap();

                        // send to all listeners
                        let _ = sender.send(msg);
                    } else {
                        tracing::warn!("Got an invalid message type");
                    }
                }
                _ => {
                    tracing::warn!("Got an invalid message type");
                }
            };
        }
    });

    println!("Websocket context {who} destroyed");
}

async fn messages(
    Query(room_query): Query<client::RoomQuery>,
    State(state): State<Arc<AppState>>,
) -> Json<Vec<client::Message>> {
    let room_id = room_query.room_id;
    let rooms = state.database.collection::<client::Room>("rooms");

    let queried_room = rooms
        .find_one(doc! {"roomId": doc! {"$eq": &room_id}}, None)
        .await
        .unwrap();

    match queried_room {
        Some(room) => Json(room.messages),
        None => {
            let room = client::Room {
                room_id,
                messages: Vec::new(),
            };
            rooms.insert_one(room, None).await.unwrap();
            Json(vec![])
        }
    }
}
