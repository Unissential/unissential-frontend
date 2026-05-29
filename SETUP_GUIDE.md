# Unissential - Complete Setup Guide

Complete setup instructions for running both the frontend and backend of the Unissential student marketplace platform.

## Project Structure

```
Unissential/
├── frontend/                  # Next.js 15 frontend (localhost:3000)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-specific modules
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities
│   │   ├── services/api/     # API service layer (NEW)
│   │   └── types/            # TypeScript definitions
│   ├── .env.local            # Frontend env config
│   └── package.json
│
└── backend/                   # Express.js backend (localhost:5000)
    ├── src/
    │   ├── app.ts            # Express app setup
    │   ├── server.ts         # Server entry point
    │   ├── config/           # Database & services
    │   ├── controllers/      # HTTP handlers
    │   ├── services/         # Business logic
    │   ├── middleware/       # Express middleware
    │   ├── routes/           # API routes
    │   ├── types/            # TypeScript definitions
    │   ├── validations/      # Zod schemas
    │   └── utils/            # Utilities
    ├── prisma/schema.prisma  # Database schema
    ├── .env                  # Backend env config
    └── package.json
```

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (comes with Node.js)
- **PostgreSQL**: 14 or higher
- **Git**: For version control

### Verify Installation

```bash
node --version      # Should be v18+
npm --version       # Should be 9+
psql --version      # Should be 14+
```

## Installation Steps

### Step 1: Database Setup

Create PostgreSQL database for development:

```bash
# Windows PowerShell
psql -U postgres -c "CREATE DATABASE unissential_db;"

# macOS/Linux
createdb unissential_db
```

Verify database creation:

```bash
psql -U postgres -l | grep unissential_db
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to inspect database
npm run prisma:studio  # Opens at localhost:5555
```

Create `.env` file:

```bash
# backend/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/unissential_db"
JWT_SECRET="your-super-secret-key-minimum-32-characters-long"
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (root)
cd ..

# Install dependencies
npm install

# Create .env.local
# Already created, verify it exists at: .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

### Option A: Run Both in Terminal (Separate tabs)

**Terminal 1 - Backend Server**:

```bash
cd backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════╗
║     UNISSENTIAL BACKEND SERVER         ║
╚════════════════════════════════════════╝
  
  Environment: development
  Port: http://localhost:5000
  API: http://localhost:5000/api
  Health: http://localhost:5000/api/health
  
  Database: ...
  
  Ready to accept requests! 🚀
```

**Terminal 2 - Frontend Server**:

```bash
npm run dev
```

Expected output:
```
  ▲ Next.js 15.5.18
  - Local:        http://localhost:3000
  - Environments: .env.local
```

### Option B: Run Both in VS Code

1. Open two integrated terminals in VS Code
2. In Terminal 1: `cd backend && npm run dev`
3. In Terminal 2: `npm run dev` (from root)
4. Both will run in parallel

### Option C: Background Process (PowerShell)

```powershell
# Start backend in background
Start-Job -ScriptBlock { cd .\backend; npm run dev }

# Start frontend
npm run dev

# Later, view all jobs
Get-Job

# Kill a specific job
Stop-Job -Id 1
Remove-Job -Id 1
```

## Accessing the Application

### Frontend
- **URL**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Type**: React + Next.js UI

### Backend API
- **Base URL**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Documentation**: See [backend/API_EXAMPLES.md](./backend/API_EXAMPLES.md)

### Database UI (Prisma Studio)
- **URL**: http://localhost:5555
- **Command**: `cd backend && npm run prisma:studio`
- **Purpose**: Browse/edit database visually

## Testing the API

### 1. Health Check

```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 2. Full Signup → Login → Create Listing Flow

**Step 1: Sign up**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@university.edu",
    "password": "TestPassword123",
    "name": "Test User",
    "university": "Test University"
  }'
```

Response includes token. Save it:
```bash
TOKEN="your-token-from-response"
```

**Step 2: Get current user**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Step 3: Create a listing**
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "2BR Apartment",
    "description": "Beautiful apartment near campus",
    "price": 1200,
    "location": "Downtown",
    "bedrooms": 2,
    "bathrooms": 1,
    "petFriendly": true
  }'
```

**Step 4: View all listings**
```bash
curl http://localhost:5000/api/listings
```

## Common Issues & Solutions

### Issue: Port Already in Use

**Backend port 5000 in use**:
```powershell
# Find and kill process on port 5000
Get-NetTCPConnection -LocalPort 5000
Stop-Process -Id <PID> -Force
```

**Frontend port 3000 in use**:
```powershell
Get-NetTCPConnection -LocalPort 3000
Stop-Process -Id <PID> -Force
```

### Issue: Database Connection Failed

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**:
1. Verify PostgreSQL is running
2. Check DATABASE_URL in `.env`
3. Verify database exists: `createdb unissential_db`
4. Test connection: `psql -U postgres -d unissential_db`

### Issue: "Cannot find module" Errors

```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install

# For backend specifically
cd backend
npm install
npm run prisma:generate
```

### Issue: TypeScript Errors

```bash
# Frontend: Check TypeScript compilation
npm run type-check

# Backend: Check TypeScript compilation
cd backend
npx tsc --noEmit
```

### Issue: CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Ensure `CLIENT_URL` in backend `.env` matches frontend URL:
```env
CLIENT_URL="http://localhost:3000"
```

## Development Workflow

### 1. Making API Changes

1. **Update Backend**:
   - Modify service or controller in `backend/src/`
   - Backend auto-reloads with `npm run dev`

2. **Update Frontend Services**:
   - Modify service in `src/services/api/`
   - Frontend auto-reloads

3. **Database Changes**:
   - Modify `backend/prisma/schema.prisma`
   - Run: `cd backend && npm run prisma:migrate`
   - View changes: `npm run prisma:studio`

### 2. Testing Workflow

```bash
# Test API endpoints
npm run dev  # In backend terminal

# Test frontend integration
npm run dev  # In frontend terminal

# Open browser and test flow
# http://localhost:3000/dashboard
```

### 3. Code Quality

**Backend**:
```bash
cd backend
npm run lint:fix      # Fix linting issues
npm run format        # Format with Prettier
npx tsc --noEmit      # Type check
```

**Frontend**:
```bash
npm run lint:fix      # Fix linting issues
npm run format        # Format with Prettier
npm run type-check    # Type check
```

## Database Migrations

### Create New Migration

When you modify `schema.prisma`:

```bash
cd backend
npm run prisma:migrate -- --name add_new_feature
```

### View Migration History

```bash
cd backend
npm run prisma:migrate -- --list
```

### Rollback Migration (Dev Only)

```bash
cd backend
npm run prisma:migrate:dev -- --edit
# Edit and save the migration file
```

## Environment Variables Reference

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Unissential
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/unissential_db"

# Authentication
JWT_SECRET="minimum-32-character-string-for-production"
JWT_EXPIRY="7d"

# Server
PORT=5000
NODE_ENV="development"  # or "production"
CLIENT_URL="http://localhost:3000"
```

## Useful Commands

### Backend Commands

```bash
cd backend

# Development
npm run dev              # Start dev server with hot reload

# Building & Running
npm run build           # Build for production
npm start               # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio UI
npm run prisma:seed     # Seed database (if configured)

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # Run TypeScript compiler

# Utilities
npm list                # List all dependencies
npm outdated            # Check for outdated packages
```

### Frontend Commands

```bash
# Development
npm run dev              # Start dev server

# Building & Running
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix linting issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript check

# Utilities
npm list                # List all dependencies
```

## Performance Optimization Tips

### Backend

1. **Database Queries**: Check Prisma query logs in dev mode
2. **Pagination**: Always use pagination for large datasets
3. **Caching**: Consider Redis for frequently accessed data (future)
4. **Indexing**: Database indexes are configured in schema

### Frontend

1. **Build Size**: Check next.js bundle analysis
2. **Images**: Use next/image component
3. **Components**: Use React.memo for expensive renders
4. **Code Splitting**: Next.js handles automatically

## Deployment Preparation

### Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] API endpoints tested with Postman/curl
- [ ] Frontend builds without errors: `npm run build`
- [ ] Backend builds without errors: `cd backend && npm run build`
- [ ] No console errors or warnings
- [ ] TypeScript strict mode passing: `npm run type-check`
- [ ] Code formatted: `npm run format`
- [ ] Security review completed

### Build for Production

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
npm run build
npm start
```

## Support & Documentation

- **Next.js**: https://nextjs.org/docs
- **Express**: https://expressjs.com/
- **Prisma**: https://www.prisma.io/docs/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **React**: https://react.dev/

## Project Status

- **Frontend**: ✅ Complete (8 pages, dashboard, responsive)
- **Backend**: ✅ Complete (APIs for all features)
- **Database**: ✅ Configured (PostgreSQL with Prisma)
- **Authentication**: ✅ JWT-based with email verification
- **Testing**: 🔄 Ready for manual testing
- **Deployment**: 📋 Ready for AWS/production setup

## Next Steps

1. ✅ Start backend: `cd backend && npm run dev`
2. ✅ Start frontend: `npm run dev`
3. ✅ Test signup/login flow
4. ✅ Create sample listings/products
5. ✅ Test roommate matching
6. 📋 Replace all mock data with API calls
7. 📋 Implement messaging WebSocket
8. 📋 Add image upload functionality
9. 📋 Deploy to AWS (ECS + RDS + CloudFront)

---

**Version**: 1.0.0
**Last Updated**: 2024
**Status**: Production-Ready Foundation
