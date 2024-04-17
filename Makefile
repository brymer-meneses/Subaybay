MODE := dev
SERVICES := backend

all: run

stop:
	docker compose --env-file .env.development down

reset-database:
	docker compose down database
	docker volume rm subaybay_db-data

run:
ifeq ($(MODE), dev)

	docker compose --env-file .env.development up --build $(SERVICES) -d
	cd app && npm run dev

else ifeq ($(MODE), prod)
	docker compose --env-file .env.development up --build

else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif
