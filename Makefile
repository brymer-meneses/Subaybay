
MODE := dev

all:
	run

database: src/database.sql
	sqlite3 -init src/database.sql database.db .quit

deps: package.json
	npm install

format:
	npx prettier --write .
	
clean:
	$(RM) database.db
	$(RM) -rf .svelte_kit
	$(RM) -rf node_modules

run: database deps
ifeq ($(MODE), prod)
	npm run build
	npm run preview
else ifeq ($(MODE), dev)
	npm run dev
else
	$(error Invalid argument `$(MODE)` for `MODE`. It should be either `prod` or `dev`, skill issue!)
endif

