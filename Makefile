.PHONY: help build up down logs clean restart rebuild migrate db-shell db-reset

help:
	@echo "Unissential Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make build              - Build all services"
	@echo "  make up                 - Start all services"
	@echo "  make down               - Stop all services"
	@echo "  make logs               - View logs (all services)"
	@echo "  make logs-backend       - View backend logs"
	@echo "  make logs-frontend      - View frontend logs"
	@echo "  make logs-db            - View database logs"
	@echo "  make restart            - Restart all services"
	@echo "  make rebuild            - Rebuild and restart all services"
	@echo "  make clean              - Stop and remove containers"
	@echo ""
	@echo "Database:"
	@echo "  make migrate            - Run Prisma migrations"
	@echo "  make db-shell           - Open PostgreSQL shell"
	@echo "  make db-reset           - Reset database (DESTRUCTIVE)"
	@echo "  make prisma-studio      - Open Prisma Studio"
	@echo ""
	@echo "Services:"
	@echo "  make backend-shell      - SSH into backend container"
	@echo "  make frontend-shell     - SSH into frontend container"
	@echo "  make backend-npm        - Run npm command in backend (usage: make backend-npm cmd='install package')"
	@echo ""
	@echo "Production:"
	@echo "  make prod-build         - Build production images"
	@echo "  make prod-up            - Start production services"
	@echo "  make prod-down          - Stop production services"
	@echo ""
	@echo "Testing:"
	@echo "  make test-frontend      - Test frontend endpoint"
	@echo "  make test-backend       - Test backend endpoint"
	@echo "  make test-db            - Test database connection"
	@echo "  make health             - Check service health"

# Development Commands
build:
	@echo "Building all services..."
	docker compose build

up:
	@echo "Starting all services..."
	docker compose up -d
	@echo ""
	@echo "Services started! Check status with: make ps"
	@echo "View logs with: make logs"

down:
	@echo "Stopping all services..."
	docker compose down

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-db:
	docker compose logs -f postgres

ps:
	docker compose ps

restart:
	@echo "Restarting all services..."
	docker compose restart

rebuild: down build up
	@echo "Services rebuilt and restarted"

clean:
	@echo "Stopping and removing containers..."
	docker compose down -v
	@echo "Clean complete"

# Database Commands
migrate:
	@echo "Running migrations..."
	docker compose exec backend npx prisma migrate dev

db-shell:
	docker compose exec postgres psql -U unissential_user -d unissential_db

db-reset:
	@echo "WARNING: This will delete all database data!"
	@read -p "Continue? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker compose up -d; \
		docker compose exec backend npx prisma migrate dev; \
		echo "Database reset complete"; \
	fi

prisma-studio:
	docker compose exec backend npx prisma studio

# Service Access
backend-shell:
	docker compose exec backend sh

frontend-shell:
	docker compose exec frontend sh

backend-npm:
	docker compose exec backend npm $(cmd)

# Testing Commands
test-frontend:
	@echo "Testing frontend..."
	curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend is running" || echo "✗ Frontend is not running"

test-backend:
	@echo "Testing backend..."
	curl -s http://localhost:5000/api/health && echo "" && echo "✓ Backend is running" || echo "✗ Backend is not running"

test-db:
	@echo "Testing database..."
	docker compose exec postgres pg_isready -U unissential_user -d unissential_db && echo "✓ Database is running" || echo "✗ Database is not running"

health:
	@echo "Checking service health..."
	@docker compose ps
	@echo ""
	@make test-frontend
	@make test-backend
	@make test-db

# Production Commands
prod-build:
	@echo "Building production images..."
	docker compose -f docker-compose.prod.yml build

prod-up:
	@echo "Starting production services..."
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	@echo "Stopping production services..."
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

# Utility Commands
prune:
	@echo "Cleaning up unused Docker resources..."
	docker system prune -a --volumes -f
	@echo "Cleanup complete"

image-size:
	@echo "Docker image sizes:"
	docker images | grep unissential

push-images:
	@echo "Pushing images to registry..."
	@echo "Configure registry in docker-compose.yml first"
	docker compose push

inspect-frontend:
	docker inspect unissential-frontend

inspect-backend:
	docker inspect unissential-backend

inspect-postgres:
	docker inspect unissential-postgres
