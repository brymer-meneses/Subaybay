MODE := dev
SERVICES := backend

all: run

stop:
	docker compose --env-file .env.development down

reset-database:
	docker-compose exec database /bin/bash -c 'mongosh subaybay -u $$MONGO_USER -p $$MONGO_PASSWORD --authenticationDatabase admin --eval "db.dropDatabase();"'

run:
ifeq ($(MODE), dev)

	docker compose --env-file .env.development up --build $(SERVICES) -d
	cd app && npm run dev

else ifeq ($(MODE), prod)
	docker compose --env-file .env.development up --build

else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif
