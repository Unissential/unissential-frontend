# API Examples & Testing Guide

Quick reference for testing all Unissential API endpoints.

## Setup

All requests should include:
```
Content-Type: application/json
```

For authenticated endpoints, include:
```
Authorization: Bearer <your-jwt-token>
```

Base URL: `http://localhost:5000/api`

---

## Authentication Endpoints

### 1. Signup

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@university.edu",
    "password": "SecurePassword123",
    "name": "John Doe",
    "university": "University Name"
  }'
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "john@university.edu",
      "name": "John Doe",
      "university": "University Name",
      "isVerified": false
    }
  },
  "message": "User created successfully. Verification email sent."
}
```

### 2. Login

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@university.edu",
    "password": "SecurePassword123"
  }'
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "john@university.edu",
      "name": "John Doe",
      "university": "University Name",
      "isVerified": true
    }
  }
}
```

### 3. Verify Email

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "verification-token-from-email"
  }'
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@university.edu",
    "isVerified": true
  }
}
```

### 4. Get Current User

**Request**:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@university.edu",
    "name": "John Doe",
    "university": "University Name",
    "bio": "...",
    "profilePicture": "..."
  }
}
```

### 5. Update Profile

**Request**:
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "bio": "Computer Science student",
    "profilePicture": "https://..."
  }'
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "john@university.edu",
    "name": "John Updated",
    "bio": "Computer Science student"
  }
}
```

---

## Listing Endpoints (Leasing)

### 1. Get All Listings

**Request**:
```bash
# Basic
curl http://localhost:5000/api/listings

# With pagination and filters
curl "http://localhost:5000/api/listings?page=1&limit=10&location=Downtown&minPrice=500&maxPrice=1500&bedrooms=2&petFriendly=true"
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Modern 2BR Apartment",
      "description": "Beautiful apartment near campus",
      "price": 1200,
      "location": "Downtown",
      "lat": 40.7128,
      "lon": -74.0060,
      "bedrooms": 2,
      "bathrooms": 1,
      "furnished": true,
      "petFriendly": true,
      "leaseStartDate": "2024-01-01",
      "leaseEndDate": "2025-01-01"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### 2. Get Listing by ID

**Request**:
```bash
curl http://localhost:5000/api/listings/listing-uuid
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Modern 2BR Apartment",
    "description": "Beautiful apartment near campus",
    "price": 1200,
    "location": "Downtown",
    "lat": 40.7128,
    "lon": -74.0060,
    "bedrooms": 2,
    "bathrooms": 1,
    "furnished": true,
    "petFriendly": true,
    "amenities": ["Gym", "Pool", "Parking"],
    "images": ["https://..."],
    "owner": {
      "id": "uuid",
      "name": "Landlord Name",
      "email": "landlord@university.edu"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 3. Create Listing

**Request**:
```bash
curl -X POST http://localhost:5000/api/listings \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Modern 2BR Apartment",
    "description": "Beautiful apartment near campus",
    "price": 1200,
    "location": "Downtown",
    "lat": 40.7128,
    "lon": -74.0060,
    "bedrooms": 2,
    "bathrooms": 1,
    "furnished": true,
    "petFriendly": true,
    "amenities": ["Gym", "Pool"],
    "images": ["https://..."],
    "leaseStartDate": "2024-01-01",
    "leaseEndDate": "2025-01-01"
  }'
```

**Response** (201):
```json
{
  "success": true,
  "data": { ... },
  "message": "Listing created successfully"
}
```

### 4. Update Listing

**Request**:
```bash
curl -X PUT http://localhost:5000/api/listings/listing-uuid \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "price": 1300
  }'
```

**Response** (200):
```json
{
  "success": true,
  "data": { ... },
  "message": "Listing updated successfully"
}
```

### 5. Delete Listing

**Request**:
```bash
curl -X DELETE http://localhost:5000/api/listings/listing-uuid \
  -H "Authorization: Bearer token"
```

**Response** (200):
```json
{
  "success": true,
  "message": "Listing deleted successfully"
}
```

### 6. Get User's Listings

**Request**:
```bash
curl "http://localhost:5000/api/listings/user/user-uuid?page=1&limit=10"
```

**Response** (200):
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { ... }
}
```

---

## Marketplace Endpoints

### 1. Get All Products

**Request**:
```bash
# With filters
curl "http://localhost:5000/api/marketplace?page=1&limit=10&category=Electronics&minPrice=50&maxPrice=500&condition=excellent&search=laptop"
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "MacBook Pro",
      "description": "Used laptop, excellent condition",
      "price": 800,
      "condition": "excellent",
      "category": "Electronics",
      "images": ["https://..."],
      "views": 42,
      "interested": 5,
      "seller": {
        "id": "uuid",
        "name": "Jane Doe",
        "email": "jane@university.edu"
      }
    }
  ],
  "pagination": { ... }
}
```

### 2. Get Product by ID

**Request**:
```bash
curl http://localhost:5000/api/marketplace/product-uuid
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "MacBook Pro",
    "description": "Used laptop, excellent condition",
    "price": 800,
    "condition": "excellent",
    "category": "Electronics",
    "images": ["https://..."],
    "views": 43,
    "interested": 5
  }
}
```

### 3. Create Product

**Request**:
```bash
curl -X POST http://localhost:5000/api/marketplace \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "MacBook Pro",
    "description": "Used laptop, excellent condition",
    "price": 800,
    "condition": "excellent",
    "category": "Electronics",
    "images": ["https://..."]
  }'
```

**Response** (201):
```json
{
  "success": true,
  "data": { ... },
  "message": "Product created successfully"
}
```

### 4. Update Product

**Request**:
```bash
curl -X PUT http://localhost:5000/api/marketplace/product-uuid \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 750
  }'
```

### 5. Delete Product

**Request**:
```bash
curl -X DELETE http://localhost:5000/api/marketplace/product-uuid \
  -H "Authorization: Bearer token"
```

### 6. Get User's Products

**Request**:
```bash
curl "http://localhost:5000/api/marketplace/user/user-uuid?page=1&limit=10"
```

---

## Roommate Endpoints

### 1. Get All Profiles

**Request**:
```bash
curl "http://localhost:5000/api/roommates?page=1&limit=10&university=MIT&minBudget=800&maxBudget=1500&sleepSchedule=night"
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "age": 21,
      "university": "MIT",
      "major": "Computer Science",
      "budget": 1000,
      "interests": ["Gaming", "Fitness"],
      "sleepSchedule": "night",
      "smoking": false,
      "partying": true,
      "bio": "Looking for fun roommate",
      "user": {
        "id": "uuid",
        "name": "Alex",
        "email": "alex@university.edu"
      }
    }
  ],
  "pagination": { ... }
}
```

### 2. Get Profile by ID

**Request**:
```bash
curl http://localhost:5000/api/roommates/profile-uuid
```

### 3. Get User's Profile

**Request**:
```bash
curl http://localhost:5000/api/roommates/user/user-uuid
```

### 4. Create Profile

**Request**:
```bash
curl -X POST http://localhost:5000/api/roommates \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 21,
    "university": "MIT",
    "major": "Computer Science",
    "budget": 1000,
    "interests": ["Gaming", "Fitness"],
    "sleepSchedule": "night",
    "smoking": false,
    "partying": true,
    "bio": "Looking for fun roommate"
  }'
```

### 5. Update Profile

**Request**:
```bash
curl -X PUT http://localhost:5000/api/roommates \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{
    "budget": 1200,
    "bio": "Updated bio"
  }'
```

### 6. Delete Profile

**Request**:
```bash
curl -X DELETE http://localhost:5000/api/roommates \
  -H "Authorization: Bearer token"
```

### 7. Find Compatible Roommates

**Request**:
```bash
curl "http://localhost:5000/api/roommates/compatible?page=1&limit=10" \
  -H "Authorization: Bearer token"
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "age": 20,
      "university": "MIT",
      "major": "Physics",
      "budget": 1000,
      "interests": ["Gaming", "Coding"],
      "compatibilityScore": 0.85
    }
  ],
  "pagination": { ... }
}
```

---

## Error Responses

### Bad Request (400)
```json
{
  "success": false,
  "error": "Password must be at least 8 characters"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "error": "Unauthorized to update this listing"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Listing not found"
}
```

---

## Testing with Postman

1. Import these endpoints into Postman
2. Set `{{baseUrl}}` variable to `http://localhost:5000/api`
3. Set `{{token}}` variable after login
4. Use `Bearer {{token}}` in Authorization header

## Testing with curl

Save tokens to environment:
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{...}' | jq -r '.data.token')

echo "Token: $TOKEN"

# Use in requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/me
```

---

## Common Issues

**Email not .edu format**:
```json
{
  "success": false,
  "error": "Email must be from an educational institution (.edu domain)"
}
```

**Ownership check failed**:
```json
{
  "success": false,
  "error": "Unauthorized to update this listing"
}
```

**Invalid token**:
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Duplicate listing**:
```json
{
  "success": false,
  "error": "Duplicate roommate profile. User can only have one profile."
}
```
