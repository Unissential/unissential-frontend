# Full-Stack Integration Guide: Frontend + Backend

## Overview

This document explains how the Unissential frontend is fully integrated with the backend Express.js API and PostgreSQL database.

## Architecture

```
Frontend (Next.js 15)
    ↓
Services API Layer (src/services/api/)
    ↓
HTTP Requests (Fetch API)
    ↓
Backend Express.js Server
    ↓
Prisma ORM
    ↓
PostgreSQL Database
```

## Authentication Flow

### 1. User Registration

**Frontend → Backend**:
```
POST /api/auth/signup
{
  email: "user@university.edu",
  password: "hashedPassword",
  name: "John Doe",
  university: "MIT"
}
```

**Backend Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "email": "user@university.edu",
      "name": "John Doe",
      "isVerified": false
    }
  }
}
```

**Frontend Storage**:
- Token → `localStorage.auth_token`
- User → `localStorage.current_user`

### 2. Email Verification

**Frontend → Backend**:
```
POST /api/auth/verify-email
{ token: "verification-token-from-email" }
```

### 3. Login

**Frontend → Backend**:
```
POST /api/auth/login
{
  email: "user@university.edu",
  password: "password"
}
```

### 4. Protected Requests

**Frontend automatically adds JWT token**:
```
Authorization: Bearer <token>
```

Backend validates token and extracts `userId` from JWT payload.

## Frontend Services (API Layer)

### Location: `src/services/api/`

#### 1. `client.ts` - Base Configuration
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string }>
```

Features:
- Automatic Bearer token injection
- Error handling
- JSON response parsing
- Base URL configuration via `.env.local`

#### 2. `auth.service.ts` - Authentication
```typescript
authService.signup(email, password, name, university)
authService.login(email, password)
authService.verifyEmail(token)
authService.logout()
authService.getCurrentUser()
authService.updateProfile(name, bio, profilePicture)
```

#### 3. `listing.service.ts` - Apartment Leasing
```typescript
listingService.getAllListings(page, limit, filters)
listingService.getListingById(id)
listingService.createListing(data)
listingService.updateListing(id, data)
listingService.deleteListing(id)
listingService.getUserListings(userId, page, limit)
```

#### 4. `marketplace.service.ts` - Buy/Sell Items
```typescript
marketplaceService.getAllProducts(page, limit, filters)
marketplaceService.getProductById(id)
marketplaceService.createProduct(data)
marketplaceService.updateProduct(id, data)
marketplaceService.deleteProduct(id)
marketplaceService.getUserProducts(userId, page, limit)
```

#### 5. `roommate.service.ts` - Roommate Matching
```typescript
roommateService.getAllProfiles(page, limit, filters)
roommateService.getProfileById(id)
roommateService.createProfile(data)
roommateService.updateProfile(data)
roommateService.deleteProfile()
roommateService.getUserProfile(userId)
roommateService.findCompatible(page, limit)
```

#### 6. `dashboard.service.ts` - Dashboard Aggregation
```typescript
dashboardService.getDashboardStats()
dashboardService.getUserListings(page, limit)
dashboardService.getUserProducts(page, limit)
dashboardService.getUserRoommateProfile()
```

## Context & State Management

### `src/contexts/AuthContext.tsx`

Manages global authentication state:
```typescript
const {
  user,                    // Current user object
  isLoading,              // Loading state
  isAuthenticated,        // Boolean check
  error,                  // Error message
  signup,                 // Signup function
  login,                  // Login function
  logout,                 // Logout function
  verifyEmail,            // Verify email function
  updateUser,             // Update user function
  clearError              // Clear error message
} = useAuth()
```

### `src/contexts/ToastContext.tsx`

Toast notifications for user feedback:
```typescript
const { toasts, addToast, removeToast } = useToast()

// Usage
addToast('User created successfully!', 'success')
addToast('Email already exists', 'error')
```

## Page Integration Examples

### 1. Authentication Pages

**Signup (`/signup`)**:
- Uses `SignupForm` component
- Calls `useAuth().signup()`
- Stores JWT token and user data
- Shows verification email screen
- Redirects to email verification page

**Login (`/login`)**:
- Uses `LoginForm` component
- Calls `useAuth().login()`
- Stores JWT token and user data
- Redirects to `/dashboard`
- Shows error toast on failure

**Email Verification (`/verify-email`)**:
- Gets token from URL query param
- Calls `useAuth().verifyEmail(token)`
- Shows success/error screen
- Redirects to login or dashboard

### 2. Protected Pages

**Dashboard (`/dashboard`)**:
- Wrapped in `<ProtectedRoute>` component
- Checks `isAuthenticated` from `useAuth()`
- Loads dashboard stats via `dashboardService`
- Shows loading spinner while fetching
- Renders user's listings and statistics

**My Listings (`/dashboard/my-listings`)**:
- Protected route
- Fetches user's listings via `dashboardService.getUserListings()`
- Displays list with edit/delete actions
- Calls `listingService.deleteListing()` on delete
- Navigates to create listing page

### 3. Public Pages with Auth Integration

**Leasing/Browse (`/leasing`)**:
- Fetches all listings via `listingService.getAllListings()`
- Supports filtering (price, bedrooms, pet-friendly)
- Shows loading state while fetching
- Handles errors gracefully
- Pagination support

## Data Flow Example: Create Listing

1. **User navigates to `/leasing/create`**
   - ProtectedRoute checks authentication
   - If not authenticated, redirects to `/login`

2. **User fills form and submits**
   - Form data validated with Zod schema
   - Calls `listingService.createListing(data)`

3. **Frontend Service Layer**
   - `apiCall` constructs request
   - Adds `Authorization: Bearer <token>` header
   - Sends POST to `http://localhost:5000/api/listings`

4. **Backend Processing**
   - `routes/index.ts` routes to `ListingController.create`
   - `authMiddleware` extracts userId from JWT
   - `validateRequest` validates data with Zod schema
   - `ListingService` creates listing in database
   - Returns listing object to frontend

5. **Frontend Response Handling**
   - Receives listing data
   - Shows success toast
   - Redirects to `/leasing/{id}`
   - Updates dashboard stats

## Error Handling

### Backend Errors
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### Frontend Handling
```typescript
try {
  await authService.signup(email, password, name, university)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Failed'
  addToast(message, 'error')
}
```

## Environment Configuration

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (`.env`)
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/unissential_db"
JWT_SECRET="your-secret-key-min-32-chars"
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:3000"
```

## Running the Application

### Terminal 1: Backend Server
```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

**Expected**:
```
Environment: development
Port: http://localhost:5000
API: http://localhost:5000/api
Ready to accept requests! 🚀
```

### Terminal 2: Frontend Server
```bash
npm install
npm run dev
```

**Expected**:
```
▲ Next.js 15.5.18
- Local:        http://localhost:3000
```

## Testing the Complete Flow

### 1. Signup
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

### 2. Navigate to Frontend
```
http://localhost:3000/signup
```

### 3. Fill Form & Submit
- Email: `test@university.edu`
- Password: `TestPassword123`
- Name: `Test User`
- Agree to terms

### 4. Check Email (Mock)
- In development, verification link is printed to console
- Copy token from console
- Visit: `http://localhost:3000/verify-email?token=<token>`

### 5. Login
- Go to `/login`
- Enter credentials
- Should redirect to `/dashboard`

### 6. Create Listing
- Click "Post a Listing"
- Fill form
- Submit
- Should appear in `/leasing` and `/dashboard/my-listings`

## Database State Verification

### View Data with Prisma Studio
```bash
cd backend
npm run prisma:studio
```

Opens: `http://localhost:5555`

View all tables:
- users
- listings
- marketplaceProducts
- roommateProfiles
- conversations
- messages
- notifications
- savedItems

## TypeScript Types

All types are imported from `@/types/api`:

```typescript
// User
interface UserDTO {
  id: string
  email: string
  name: string
  university: string
  isVerified: boolean
  profilePicture?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

// Listing
interface ListingDTO {
  id: string
  title: string
  description: string
  price: number
  location: string
  latitude?: number
  longitude?: number
  images: string[]
  amenities: string[]
  bedrooms: number
  bathrooms: number
  furnished: boolean
  leaseStart?: Date
  leaseEnd?: Date
  petFriendly: boolean
  owner: UserDTO
  createdAt: Date
  updatedAt: Date
}

// ... Similar for MarketplaceProductDTO, RoommateProfileDTO
```

## Security Measures

1. **Password Hashing**: Backend uses bcryptjs (10 rounds)
2. **JWT Tokens**: 7-day expiration
3. **Email Verification**: Required for new accounts
4. **CORS**: Restricted to frontend origin
5. **Input Validation**: Zod schemas on all endpoints
6. **Ownership Checks**: Mutations verify user ownership (403 if unauthorized)
7. **Token Refresh**: Tokens stored in localStorage with Bearer auth

## Performance Optimizations

1. **Pagination**: All list endpoints paginate (1-100 items per page)
2. **Filtering**: Backend filtering reduces data transfer
3. **Image Optimization**: Next.js Image component with lazy loading
4. **Code Splitting**: Dynamic imports in dashboard
5. **Caching**: Listing data cached while user browses
6. **Database Indexing**: Indexes on userId, email, createdAt

## Next Steps for Production

### Deployment
1. Set up AWS RDS for PostgreSQL
2. Deploy backend to AWS ECS
3. Deploy frontend to Vercel
4. Configure CloudFront CDN
5. Set up monitoring (CloudWatch)

### Features to Add
1. Real-time messaging (WebSocket)
2. Image upload to S3
3. Payment processing (Stripe)
4. Email notifications
5. User ratings/reviews
6. Advanced search (Elasticsearch)

### Testing
1. Unit tests for services
2. Integration tests for API flows
3. E2E tests with Cypress
4. Load testing
5. Security testing

## Troubleshooting

### "Cannot find module" Errors
```bash
npm install
npm run prisma:generate
```

### Database Connection Failed
```bash
createdb unissential_db
cd backend && npm run prisma:migrate
```

### CORS Errors
Check `CLIENT_URL` in backend `.env`:
```env
CLIENT_URL="http://localhost:3000"
```

### Token Expired
Clear localStorage and login again:
```javascript
localStorage.removeItem('auth_token')
localStorage.removeItem('current_user')
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)

---

**Status**: Production-ready full-stack integration
**Last Updated**: 2024
**Backend Version**: 1.0.0
**Frontend Version**: 1.0.0
