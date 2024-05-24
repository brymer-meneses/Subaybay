mod database;
mod error;
mod middlewares;
mod routes;
mod state;
mod utils;

use dotenv::dotenv;
use std::net::SocketAddr;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Config {
    database_hostname: String,
    database_name: String,
    database_username: String,
    database_password: String,
    database_port: u16,

    backend_port: u16,
    app_port: u16,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    use envy::Error::{Custom, MissingValue};

    let config = match envy::from_env::<Config>() {
        Err(MissingValue(variable)) => {
            panic!("The environment variable `{variable}` is not loaded")
        }

        Err(Custom(error)) => {
            panic!("{error}");
        }

        Ok(config) => config,
    };

    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let app = routes::root(&config).await;
    let address = format!("0.0.0.0:{}", config.backend_port);
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();

    tracing::info!("listening on {}", listener.local_addr().unwrap());

    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}
