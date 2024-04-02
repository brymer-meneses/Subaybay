MODE := dev
SERVICES := backend

all: run

stop:
	docker compose --env-file .env.dev down

run:
ifeq ($(MODE), dev)

	docker compose --env-file .env.dev up --build $(SERVICES) -d
	cd app && npm run dev

else ifeq ($(MODE), prod)
	docker compose --env-file .env.dev up --build

else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif
