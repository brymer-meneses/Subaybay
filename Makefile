MODE := dev

all: run

run-database:
	docker compose --env-file .env.dev up --build database -d

run-backend:
	docker compose --env-file .env.dev up --build backend -d

run:
ifeq ($(MODE), dev)
	docker compose --env-file .env.dev up --build database backend -d
	cd backend && npm run dev
else ifeq ($(MODE), prod)
	docker compose --env-file .env.dev up --build
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif
