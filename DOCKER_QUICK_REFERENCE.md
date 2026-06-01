# Docker Quick Reference

## Essential Commands

```bash
# Start everything
make up

# Stop everything
make down

# View all logs
make logs

# Rebuild everything
make rebuild

# Check health
make health
```

## Development Workflow

```bash
# 1. Initial setup
docker compose build
docker compose up -d

# 2. Run migrations
docker compose exec backend npx prisma migrate dev

# 3. View logs
docker compose logs -f

# 4. Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# Database: localhost:5432

# 5. Stop when done
docker compose down
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `lsof -i :3000` then `kill -9 <PID>` |
| Database connection failed | `docker compose logs postgres` |
| Frontend can't reach backend | `docker compose exec frontend curl http://backend:5000/api/health` |
| Services not starting | `docker compose logs` to check all logs |
| Out of disk | `docker system prune -a --volumes` |

## Database Operations

```bash
# Connect to database
make db-shell

# Run migrations
make migrate

# Reset database (DESTRUCTIVE)
make db-reset

# Open Prisma Studio
make prisma-studio
```

## Container Access

```bash
# SSH into backend
make backend-shell

# SSH into frontend
make frontend-shell

# Install npm package in backend
make backend-npm cmd='install package-name'
```

## Production Deployment

```bash
# Build production images
make prod-build

# Start production services
make prod-up

# View production logs
make prod-logs

# Stop production
make prod-down
```

## Environment Variables

See `docker-compose.env` for available variables.

For production: Create `.env.production` with appropriate values.

## File Structure

```
unissential/
├── Dockerfile.frontend              # Frontend build
├── backend/Dockerfile              # Backend build
├── docker-compose.yml              # Development
├── docker-compose.prod.yml         # Production
├── DOCKER_SETUP.md                 # Detailed guide
├── AWS_DEPLOYMENT.md               # AWS guide
├── Makefile                        # Command shortcuts
└── docker-compose.env              # Environment template
```

## Health Check Endpoints

- Frontend: `GET http://localhost:3000`
- Backend: `GET http://localhost:5000/api/health`
- Database: `pg_isready` via container

## Additional Resources

- [Full Docker Setup Guide](DOCKER_SETUP.md)
- [AWS Deployment Guide](AWS_DEPLOYMENT.md)
- [Project Documentation](README.md)

## Quick Links

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Postgres: localhost:5432
- Prisma Studio: `make prisma-studio`

---

**Need help?** Check the full guides or run `make help` for all available commands.
