COMPOSE_FILE = docker-compose.yml

.PHONY: all build up down logs

all: build up
rebuild: down up

build:
	docker-compose -f $(COMPOSE_FILE) build

up:
	docker-compose -f $(COMPOSE_FILE) up -d

down:
	docker-compose -f $(COMPOSE_FILE) down
	docker volume prune -f

logs:
	docker-compose -f $(COMPOSE_FILE) logs -f