install:
	pnpm install

start:
	docker compose -f docker-compose.dev.yml up

import-data:
	docker exec wallethd-backend-dev-api node _data/seeder.js -i

delete-data:
	docker exec wallethd-backend-dev-api node _data/seeder.js -d

reset-data:
	docker exec wallethd-backend-dev-api node _data/seeder.js -d
	docker exec wallethd-backend-dev-api node _data/seeder.js -i