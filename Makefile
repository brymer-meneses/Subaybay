
MODE := dev
SERVICES := backend docs

all: run

stop:
	docker compose down

reset-database:
ifeq ($(MODE), dev)
	docker compose -f compose.local.yaml down database
	docker volume rm subaybay-local_db-data
else ifeq ($(MODE), prod)
	docker compose -f compose.production.yaml down database
	docker volume rm subaybay-production-data
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif

format:
	cd app && npx prettier --write .

run:
ifeq ($(MODE), dev)
	docker compose -f compose.local.yaml --env-file .env up --build $(SERVICES) -d
	@cd app && npm run dev
else ifeq ($(MODE), prod)
	docker compose -f compose.production.yaml --env-file .env up --build -d
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif

