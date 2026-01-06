.DEFAULT_GOAL := help

help:
	@echo "make up         : build & up"
	@echo "make down       : down"
	@echo "make ps         : status"
	@echo "make logs       : follow all logs"
	@echo "make logs-nginx : nginx logs"
	@echo "make logs-be    : backend logs"
	@echo "make logs-fe    : frontend logs"
	@echo "make be         : backend shell"
	@echo "make fe         : frontend shell"

up:
	docker compose up -d --build

down:
	docker compose down

ps:
	docker compose ps

logs:
	docker compose logs -f

logs-nginx:
	docker compose logs -f nginx

logs-be:
	docker compose logs -f backend

logs-fe:
	docker compose logs -f frontend

be:
	docker compose exec backend bash

fe:
	docker compose exec frontend sh
