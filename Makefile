
MODE := dev

all: run

migrate:
	sqlite3 -init src/database.sql database.db .quit

deps: package.json
	npm install

format:
	npx prettier --write .
	
clean:
	$(RM) database.db
	$(RM) -rf .svelte_kit
	$(RM) -rf node_modules

run: deps
ifeq ($(MODE), prod)
	npm run build
	npm run preview
else ifeq ($(MODE), dev)
	$(MAKE) migrate
	npm run dev
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif

