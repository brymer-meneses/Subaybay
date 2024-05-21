include .env

MODE := dev
SERVICES := backend
ENVIRONMENT_VARIABLES := \
	DATABASE_USERNAME=${DATABASE_USERNAME} \
	DATABASE_PASSWORD=${DATABASE_PASSWORD} \
	GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
	GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \

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
	@cd app && $(ENVIRONMENT_VARIABLES) npm run dev
else ifeq ($(MODE), prod)
	docker compose --env-file .env up --build
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif

