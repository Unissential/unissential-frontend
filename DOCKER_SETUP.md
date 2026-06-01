# Docker Setup Guide for Unissential

## Overview

This guide covers building and running the complete Unissential stack using Docker:
- Frontend (Next.js 15)
- Backend (Express with TypeScript)
- Database (PostgreSQL 16)

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- Git

## Project Structure

```
unissential/
├── Dockerfile.frontend          # Frontend multi-stage build
├── backend/
│   └── Dockerfile              # Backend multi-stage build
│   └── .dockerignore           # Build context exclusions
├── .dockerignore               # Root build context exclusions
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose
├── .env.example                # Frontend env template
├── backend/.env.example        # Backend env template
└── docker-compose.env          # Docker compose env vars
```

## Setup Instructions

### 1. Environment Configuration

Create `.env.local` in root for Docker Compose variables:

```bash
# Copy and configure
cp docker-compose.env .env.local
```

Update `.env.local`:

```bash
# Database
DB_USER=unissential_user
DB_PASSWORD=your_secure_password_here_change_this
DB_NAME=unissential_db
DB_PORT=5432

# Backend
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production-32-chars-min
CLIENT_URL=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Development Setup

#### Quick Start

```bash
# Build all services
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

#### What This Does

1. Creates `unissential-postgres` (port 5432)
2. Starts `unissential-backend` (port 5000)
3. Starts `unissential-frontend` (port 3000)
4. Creates named volume `postgres_data` for database persistence
5. Creates bridge network `unissential-network`

#### Verify Services are Running

```bash
# Check service status
docker compose ps

# Test frontend
curl http://localhost:3000

# Test backend API
curl http://localhost:5000/api/health

# Test database connection
docker compose exec postgres psql -U unissential_user -d unissential_db -c "SELECT 1;"
```

### 3. Database Management

#### Run Migrations

```bash
# Run Prisma migrations
docker compose exec backend npx prisma migrate dev

# Generate Prisma client
docker compose exec backend npx prisma generate

# Open Prisma Studio
docker compose exec backend npx prisma studio
```

#### Database Shell

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U unissential_user -d unissential_db

# List tables
\dt

# Exit
\q
```

#### Reset Database (Development)

```bash
# WARNING: This deletes all data
docker compose down -v
docker compose up -d
docker compose exec backend npx prisma migrate dev
```

### 4. Backend Management

#### View Logs

```bash
# Backend logs only
docker compose logs -f backend

# Follow backend output
docker compose logs -f backend --tail=50
```

#### Install Dependencies

```bash
# Inside container
docker compose exec backend npm install

# Add new package
docker compose exec backend npm install package-name
```

#### Rebuild Backend

```bash
# Rebuild after changes
docker compose build backend
docker compose up -d backend
```

### 5. Frontend Management

#### View Logs

```bash
# Frontend logs only
docker compose logs -f frontend

# Follow output
docker compose logs -f frontend --tail=50
```

#### Install Dependencies

```bash
# Inside container
docker compose exec frontend npm install

# Add package
docker compose exec frontend npm install package-name
```

#### Rebuild Frontend

```bash
# Rebuild after changes
docker compose build frontend
docker compose up -d frontend
```

### 6. Health Checks

All services include health checks:

```bash
# Check service health
docker compose ps

# Health check details
docker inspect unissential-frontend
docker inspect unissential-backend
docker inspect unissential-postgres
```

Services will auto-restart if unhealthy.

## Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Update environment variables
# Edit .env.production with actual values

# 2. Build images
docker compose -f docker-compose.prod.yml build

# 3. Run security scan
docker scan unissential-frontend
docker scan unissential-backend

# 4. Test locally
docker compose -f docker-compose.prod.yml up

# 5. Verify endpoints
curl http://localhost:3000
curl http://localhost:5000/api/health
```

### Production Commands

```bash
# Deploy
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop
docker compose -f docker-compose.prod.yml down

# Update services
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## Dockerfile Details

### Frontend (Dockerfile.frontend)

- **Base Image**: node:22-alpine (90MB)
- **Stages**: 3 (deps, builder, runner)
- **Optimizations**:
  - Multi-stage build reduces final size
  - Non-root user (nextjs)
  - Proper signal handling (dumb-init)
  - Health check included
  - Production Next.js optimization

### Backend (backend/Dockerfile)

- **Base Image**: node:22-alpine (90MB)
- **Stages**: 3 (deps, builder, runner)
- **Optimizations**:
  - Multi-stage build
  - Non-root user (nodejs)
  - Prisma client generation
  - TypeScript compilation
  - Health check with curl
  - Production optimization

## Networking

Services communicate via internal Docker network:

```
Frontend → Backend: http://backend:5000
Backend → Database: postgresql://postgres:5432
```

External access:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Database: localhost:5432

## Common Issues

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Kill process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

### Database Connection Refused

```bash
# Check PostgreSQL is healthy
docker compose ps

# Verify health
docker compose exec postgres pg_isready

# Check logs
docker compose logs postgres
```

### Frontend Can't Connect to Backend

```bash
# Check network connectivity
docker compose exec frontend curl http://backend:5000/api/health

# Verify environment
docker compose exec frontend printenv | grep API_URL

# Check backend logs
docker compose logs backend
```

### Out of Disk Space

```bash
# Clean unused images
docker image prune -a

# Clean volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

## Best Practices

### Development

- Use `docker compose up` for hot reload
- Mount source directories with volumes
- Use `.dockerignore` to reduce context
- Check health with `docker compose ps`

### Production

- Use `docker compose.prod.yml`
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET` (32+ characters)
- Secure environment variables
- Use health checks for orchestration
- Enable restart policies
- Use container registries (ECR, Docker Hub)
- Implement logging aggregation

### Security

- Use non-root users (done in Dockerfiles)
- Set restart policies
- Use environment variables (not hardcoded)
- Scan images for vulnerabilities
- Keep base images updated
- Use .dockerignore files
- Implement resource limits (if using Swarm/K8s)

## AWS Deployment (Future)

These Docker images are ready for:

### AWS ECS

1. Push images to ECR
2. Create ECS task definition
3. Create ECS service
4. Use RDS for PostgreSQL
5. Use load balancer (ALB)

### AWS EKS

1. Push images to ECR
2. Create Kubernetes manifests
3. Deploy with `kubectl apply`
4. Use RDS or managed database
5. Use ingress controller

### AWS Amplify

1. Connect GitHub repository
2. Configure build settings
3. Deploy automatically on push
4. Use API Gateway for backend

## Troubleshooting

### Enable Debug Logging

```bash
# Backend
docker compose exec backend npm run build

# Check logs
docker compose logs backend --tail=100
```

### Inspect Running Container

```bash
# Shell access
docker compose exec backend sh
docker compose exec frontend sh

# Check environment
docker compose exec backend env
docker compose exec frontend env
```

### Validate Configuration

```bash
# Validate compose file
docker compose config

# Check service dependencies
docker compose config --services
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

## Support

For issues or questions:
1. Check logs: `docker compose logs -f`
2. Verify services: `docker compose ps`
3. Test connectivity: `docker compose exec <service> <command>`
4. Review this guide and troubleshooting section
