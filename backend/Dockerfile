FROM rust:1.77

WORKDIR /backend

# https://stackoverflow.com/a/74292807
RUN mkdir src
RUN echo 'fn main() { panic!("Dummy Image Called!")}' > ./src/main.rs
COPY ["Cargo.toml", "Cargo.lock",  "./"]
RUN cargo build --release
COPY src src

# need to break the cargo cache
RUN touch ./src/main.rs
RUN cargo build --release

CMD ["./target/release/backend"]


expose 8080
