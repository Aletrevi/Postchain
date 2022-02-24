.PHONY: help

-include .env


help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

up: ## Starts project using docker-compose
	docker-compose -f ./compose/docker-compose.yaml up --build

monitoring: ## Starts monitoring stack using docker-compose
	docker-compose -f ./compose/docker-compose.monitoring.yaml up --build

kubernetes: ## Starts project using minikube
	@kubectl apply -R -f k8s

cluster-ip:	## Get entrypoint for k8s
	@minikube service -n kong kong-proxy --url | head -1
production-up: ## Starts project using docker-compose
	docker-compose -f ./compose/docker-compose.production.yaml up --build
