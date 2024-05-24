FROM rust:1.77 AS build

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

FROM rust:1.77 AS run

WORKDIR /backend
COPY --from=build /backend/target/release/backend ./backend

CMD ["./backend"]

EXPOSE 8080
