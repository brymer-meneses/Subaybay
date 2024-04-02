FROM rust:1.77

WORKDIR /backend
COPY . .

RUN cargo install --path .

CMD ["backend"]

expose 8080
