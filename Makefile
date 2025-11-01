install:
	pnpm install

start:
	pnpm dev

docker-dev:
	docker compose -f docker-compose.dev.yml up