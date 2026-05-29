# Unissential Backend API

Production-grade Express.js backend for the Unissential student marketplace platform. Built with TypeScript, PostgreSQL, Prisma ORM, and JWT authentication.

## Architecture Overview

```
src/
├── config/        # Database and external service configuration
├── controllers/   # HTTP request handlers (Auth, Listing, Marketplace, Roommate)
├── middleware/    # Express middleware (auth, validation, error handling)
├── services/      # Business logic layer
├── routes/        # API endpoint definitions and routing
├── types/         # TypeScript interfaces and DTOs
├── utils/         # Utility functions (crypto, JWT, distance calculations)
├── validations/   # Zod request validation schemas
├── app.ts         # Express app configuration
└── server.ts      # Server entry point
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18+
- **Language**: TypeScript 5.3+
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Environment**: dotenv

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/unissential_db"

# JWT
JWT_SECRET="your-secret-key-min-32-characters"
JWT_EXPIRY="7d"

# Server
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
```

### 3. Setup Database

Create PostgreSQL database:

```bash
createdb unissential_db
```

Generate Prisma client:

```bash
npm run prisma:generate
```

Run migrations:

```bash
npm run prisma:migrate
```

Open Prisma Studio to inspect data:

```bash
npm run prisma:studio
```

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production Mode

```bash
npm run build
npm run start
```

### Health Check

```bash
curl http://localhost:5000/api/health
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/verify-email` | Verify email token | No |
| POST | `/api/auth/resend-verification` | Resend verification email | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

### Listings (Leasing)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/listings` | Get all listings with filters | No |
| GET | `/api/listings/:id` | Get listing by ID | No |
| POST | `/api/listings` | Create listing | Yes |
| PUT | `/api/listings/:id` | Update listing | Yes |
| DELETE | `/api/listings/:id` | Delete listing | Yes |
| GET | `/api/listings/user/:userId` | Get user's listings | No |

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `location`: Filter by location
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price
- `bedrooms`: Filter by number of bedrooms
- `petFriendly`: Filter by pet-friendly status (true/false)

### Marketplace Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/marketplace` | Get all products with filters | No |
| GET | `/api/marketplace/:id` | Get product by ID | No |
| POST | `/api/marketplace` | Create product | Yes |
| PUT | `/api/marketplace/:id` | Update product | Yes |
| DELETE | `/api/marketplace/:id` | Delete product | Yes |
| GET | `/api/marketplace/user/:userId` | Get user's products | No |

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `category`: Filter by category
- `minPrice`: Filter by minimum price
- `maxPrice`: Filter by maximum price
- `condition`: Filter by condition (like_new/excellent/good/fair)
- `search`: Search in title and description

### Roommate Profiles

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| GET | `/api/roommates` | Get all profiles with filters | No |
| GET | `/api/roommates/:id` | Get profile by ID | No |
| GET | `/api/roommates/user/:userId` | Get user's profile | No |
| POST | `/api/roommates` | Create profile | Yes |
| PUT | `/api/roommates` | Update profile | Yes |
| DELETE | `/api/roommates` | Delete profile | Yes |
| GET | `/api/roommates/compatible` | Find compatible roommates | Yes |

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `university`: Filter by university
- `minBudget`: Filter by minimum budget
- `maxBudget`: Filter by maximum budget
- `sleepSchedule`: Filter by sleep schedule

## Database Models

### User
- Email (unique, .edu required)
- Password (bcrypt hashed)
- Name, University
- Email verification status and token
- Profile picture and bio
- Relationships: listings, products, roommate profile, saved items, messages

### Listing
- Title (max 80 chars), Description (max 2000 chars)
- Price, Location, Coordinates (lat/lon)
- Images, Amenities
- Bedrooms, Bathrooms, Furnished status
- Lease dates, Pet-friendly flag
- Owner relationship

### MarketplaceProduct
- Title, Description
- Price, Condition (like_new/excellent/good/fair)
- Category, Images
- View count, Interest count
- Seller relationship

### RoommateProfile
- Age, University, Major
- Budget, Sleep Schedule
- Interests, Smoking/Partying flags
- Bio, User relationship (unique)

### Conversation & Message
- Multi-user conversations
- Message history with sender info

### SavedItem
- Polymorphic design supporting listings, products, roommate profiles
- User relationship

### Notification
- Type-based notifications (message/tour/listing/roommate/product)
- Read status, User relationship

## Authentication Flow

1. **Signup**:
   - POST `/api/auth/signup` with email, password, name, university
   - Returns JWT token and verification email sent
   - Email must be .edu format

2. **Email Verification**:
   - User clicks verification link with token
   - POST `/api/auth/verify-email` with token
   - Sets isVerified flag to true

3. **Login**:
   - POST `/api/auth/login` with email, password
   - Returns JWT token (valid for 7 days)

4. **Protected Requests**:
   - Include `Authorization: Bearer <token>` header
   - Middleware verifies token and extracts userId

## Error Handling

All responses follow consistent format:

```json
{
  "success": true/false,
  "data": {},
  "error": "error message if failed",
  "message": "success message if applicable"
}
```

HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (missing/invalid auth)
- `403`: Forbidden (ownership check failed)
- `404`: Not Found
- `500`: Server Error

## Validation

Request validation using Zod schemas:

- **Signup**: 8+ char password, .edu email
- **Listings**: 80 char title, 2000 char description
- **Marketplace Products**: 5-100 char title
- **Roommate Profiles**: Age 18+, positive budget, interests array
- **Pagination**: 1-100 items per page

## Development

### Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build & Production
npm run build           # Compile TypeScript
npm start               # Start production server

# Database
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run migrations
npm run prisma:studio   # Open Prisma Studio UI

# Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking
```

### Project Structure Conventions

- **Controllers**: HTTP handlers, validation, response formatting
- **Services**: Business logic, database operations, error handling
- **Middleware**: Auth, validation, error handling, logging
- **Utils**: Pure functions (crypto, calculations, formatting)
- **Types**: Shared DTOs and interfaces (remove sensitive data)
- **Validations**: Zod schemas for all inputs

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting
- 2-space indentation
- Meaningful variable/function names
- JSDoc comments for complex functions
- Error handling in all services
- Ownership checks in mutations

## Security

- **Passwords**: Bcryptjs with 10 salt rounds
- **JWT**: 7-day expiration, strong secret required
- **Email Validation**: .edu domain required
- **Ownership**: Protected mutations require user ownership
- **CORS**: Configured with frontend URL
- **Input Validation**: Zod schemas on all inputs
- **Token Storage**: Bearer token in Authorization header

## Deployment

### Preparation

1. Update `.env` with production values:
   ```env
   NODE_ENV=production
   DATABASE_URL=<production_db_url>
   JWT_SECRET=<strong_secret_32_chars>
   CLIENT_URL=<production_frontend_url>
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. Run tests to validate:
   ```bash
   npm test
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### AWS Deployment (Future)

When ready for AWS deployment:
1. Set up RDS PostgreSQL database
2. Deploy to Elastic Beanstalk or ECS
3. Configure CloudFront CDN
4. Set up CloudWatch monitoring
5. Enable auto-scaling groups

## Performance Optimizations

- Indexed database queries (email, userId, createdAt, category)
- Pagination to limit response size
- Lazy loading relationships
- Connection pooling via Prisma
- Response DTOs exclude sensitive data
- Efficient filtering and search

## Testing

```bash
# Run tests (if implemented)
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## Monitoring & Logging

- Console logging in development
- Request logging via middleware
- Error logging with stack traces
- Query logging in dev environment

## Future Enhancements

- [ ] Message/Chat API endpoints
- [ ] Notification subscriptions (WebSocket)
- [ ] Real-time location tracking
- [ ] Image upload to S3
- [ ] Payment processing
- [ ] Advanced search with Elasticsearch
- [ ] User ratings and reviews
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] OAuth social login

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5000
kill -9 <PID>
```

### Database Connection Failed
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `createdb unissential_db`

### JWT Errors
- Ensure JWT_SECRET is set (min 32 chars)
- Check token expiration
- Verify token in Authorization header format

### Prisma Errors
- Clear Prisma cache: `rm -rf node_modules/.prisma`
- Regenerate: `npm run prisma:generate`
- Check schema syntax

## Support & Documentation

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)
- [RESTful API Design Best Practices](https://restfulapi.net/)

## License

MIT License - See LICENSE file for details

## Contributing

1. Follow code quality standards
2. Add type safety (no `any`)
3. Include error handling
4. Test before committing
5. Update documentation

---

**Last Updated**: 2024
**Version**: 1.0.0 (MVP)
**Status**: Production-Ready Foundation
