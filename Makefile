
MODE := dev
SERVICES := backend docs app

all: run

stop:
	docker compose down

reset-database:
	docker compose -f compose.yaml down database
	docker volume rm subaybay_db-data

format:
	cd app && npx prettier --write .

start:
	docker compose -f compose.yaml --env-file .env up --build $(SERVICES) -d

