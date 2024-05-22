
MODE := dev
SERVICES := backend

all: run

stop:
	docker compose down

reset-database:
	docker compose down database
	docker volume rm subaybay_db-data

format:
	cd app && npx prettier --write .

run:
ifeq ($(MODE), dev)
	docker compose --env-file .env up --build $(SERVICES) -d
	@cd app && npm run dev
else ifeq ($(MODE), prod)
	docker compose --env-file .env up --build -d
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif

