use std::collections::HashMap;
use std::net::SocketAddr;

use axum::extract::ws::{Message, WebSocket};
use axum::extract::{ConnectInfo, Query, WebSocketUpgrade};
use axum::{response::IntoResponse, routing, Router};
use axum_extra::TypedHeader;

use futures::{SinkExt, StreamExt};

use mongodb::{
    bson::doc,
    options::{ClientOptions, ServerApi, ServerApiVersion},
    Client,
};

use tokio;
use tower_http::trace::TraceLayer;
use tracing;
use tracing_subscriber;

async fn initialize_client() -> Client {
    let uri = "mongodb://admin:password@localhost:3000";
    let client = {
        let mut options = ClientOptions::parse_async(uri).await.expect("Invalid URI");
        options.server_api = Some(ServerApi::builder().version(ServerApiVersion::V1).build());
        Client::with_options(options).expect("Failed to create client")
    };

    client
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .init();

    let client = initialize_client().await;

    client
        .database("admin")
        .run_command(doc! {"ping": 1}, None)
        .await
        .unwrap();

    let app = Router::new()
        .route("/", routing::get(root))
        .route("/chat/ws", routing::get(ws_handler))
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

async fn ws_handler(
    ws: WebSocketUpgrade,
    _params: Option<Query<HashMap<String, String>>>,
    user_agent: Option<TypedHeader<headers::UserAgent>>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
) -> impl IntoResponse {
    let user_agent = if let Some(TypedHeader(user_agent)) = user_agent {
        user_agent.to_string()
    } else {
        String::from("Unknown browser")
    };

    println!("`{user_agent}` at {addr} connected.");

    // finalize the upgrade process by returning upgrade callback.
    // we can customize the callback by sending additional info such as address.
    ws.on_upgrade(move |socket| handle_socket(socket, addr))
}

async fn handle_socket(mut socket: WebSocket, who: SocketAddr) {
    if socket.send(Message::Ping(vec![1, 2, 3])).await.is_ok() {
        println!("Pinged {who}");
    } else {
        println!("Could not send ping {who}!");
        return;
    }

    let (mut sender, mut receiver) = socket.split();

    tokio::spawn(async move {
        while let Some(Ok(msg)) = receiver.next().await {
            match msg {
                Message::Text(msg) => {
                    sender
                        .send(Message::Text(format!("Echoing back `{}`", msg)))
                        .await
                }

                _ => sender.send("Invalid content sent".into()).await,
            }
            .expect("Failed");
        }
    });

    println!("Websocket context {who} destroyed");
}

async fn root() -> &'static str {
    "Hello there!"
}
