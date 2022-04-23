.PHONY: help

ENV ?= development		# Defaults to development
-include .env			# Load base env
-include .env.$(ENV)	# Load based on current environment

help: ## This help.
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

docker-login:
ifeq ($(USERNAME),)
	$(error Set USERNAME value on .env.$(ENV)) 
else
	docker login -u $(USERNAME) -p $(PASSWORD) $(REGISTRY)
endif

deploy: docker-login build push
	@echo Deploying $(IMAGE_NAME):$(IMAGE_TAG)

build:
	@echo Building image $(IMAGE_NAME):$(IMAGE_TAG)
	# TODO: infere dockerfile to use based on env
	docker build -f ./docker/dockerfile.production -t $(IMAGE_NAME):$(IMAGE_TAG) -t $(IMAGE_NAME):latest .
    
push: 
	@echo Pushing $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(IMAGE_NAME):latest