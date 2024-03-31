MODE := dev

CONFIG := \
	APP_PORT=80 \
	DATABASE_PORT=3000

all: run

run:
ifeq ($(MODE), dev)
	$(CONFIG) docker-compose up
else ifeq ($(MODE), prod)
	$(CONFIG) docker-compose up > log.txt
else
	$(error Invalid argument `$(MODE)` for `MODE`. Expected either `prod` or `dev`.)
endif
