# Backend Integration Guide

## Phase-Based Backend Integration

This guide shows how to smoothly transition from frontend-only with mock data to a full production backend.

---

## Phase 1: Current State - Frontend Only ✅

**Current Setup:**
- Mock data in `src/data/mockRoommates.ts`
- API routes in `app/api/*` return mock responses
- No real backend required to develop features

**Example: Roommates Feature**

```typescript
// src/data/mockRoommates.ts
export const mockRoommates: RoommateProfile[] = [
  { id: '1', name: 'Alice', ... },
  { id: '2', name: 'Bob', ... },
];

// app/api/roommates/route.ts
export async function GET() {
  return NextResponse.json({ data: mockRoommates });
}
```

**What works:**
- UI development
- Component testing
- Filtering/searching logic
- User flows

**No changes needed in components** when switching to real backend!

---

## Phase 2: Prepare for Backend (Week 1-2)

### 2.1 Create Backend Feature APIs

Stop using mock routes, point to real backend:

```typescript
// src/features/roommate/api.ts
export const roommateApi = {
  /**
   * Before: api.get('/roommates') → mock data
   * After: api.get('/roommates') → real backend
   * 
   * No code changes in components needed!
   */
  list: async (filters?: FilterDTO) => {
    const response = await api.get<RoommateProfile[]>('/roommates', {
      params: filters,
    });
    return response;
  },

  detail: async (id: string) => {
    return api.get<RoommateProfile>(`/roommates/${id}`);
  },

  create: async (data: CreateRoommateDTO) => {
    return api.post<RoommateProfile>('/roommates', data);
  },

  update: async (id: string, data: UpdateRoommateDTO) => {
    return api.put<RoommateProfile>(`/roommates/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete(`/roommates/${id}`);
  },
};
```

### 2.2 Create Feature Hooks

```typescript
// src/features/roommate/hooks.ts
/**
 * These hooks handle data fetching and caching
 * They abstract away API details from components
 */

export const useRoommates = (filters?: FilterDTO) => {
  const [roommates, setRoommates] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRoommates = async () => {
      setLoading(true);
      try {
        const data = await roommateApi.list(filters);
        setRoommates(data);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoommates();
  }, [filters]);

  return { roommates, loading, error };
};

export const useRoommateDetail = (id: string) => {
  const [roommate, setRoommate] = useState<RoommateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    roommateApi
      .detail(id)
      .then(setRoommate)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { roommate, loading, error };
};
```

### 2.3 Use Hooks in Components

```typescript
// Usage in components - NEVER call API directly
export const RoommatesPage = () => {
  const [filters, setFilters] = useState({});
  const { roommates, loading, error } = useRoommates(filters);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div>
      {roommates.map(roommate => (
        <RoommateCard key={roommate.id} roommate={roommate} />
      ))}
    </div>
  );
};
```

---

## Phase 3: Backend Ready (Week 3)

### 3.1 Environment Configuration

Update `.env.production`:

```env
# Before: Points to local mock API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# After: Points to real backend
NEXT_PUBLIC_API_URL=https://api.unissential.com
```

### 3.2 Remove Mock API Routes

```bash
# Delete these mock routes
rm app/api/roommates/route.ts
rm app/api/leasing/route.ts
rm app/api/marketplace/route.ts
```

### 3.3 Authentication Integration

```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types/models/user';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    user,
    authenticated,
    loading,
    login: authService.login,
    signup: authService.signup,
    logout: authService.logout,
  };
};
```

---

## Phase 4: Advanced Features (Week 4+)

### 4.1 File Upload to S3

```typescript
// src/features/roommate/hooks.ts
export const useCreateRoommate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (formData: FormData) => {
    setLoading(true);
    try {
      // 1. Upload photos to S3
      const photoUrls: string[] = [];
      for (const file of formData.getAll('photos') as File[]) {
        const { url } = await uploadService.uploadFile(file, 'profile');
        photoUrls.push(url);
      }

      // 2. Create roommate profile with photo URLs
      const roommateData = {
        name: formData.get('name'),
        age: Number(formData.get('age')),
        photos: photoUrls,
        // ... other fields
      };

      const created = await roommateApi.create(roommateData);
      return created;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};
```

### 4.2 Real-time Chat (Future)

```typescript
// src/services/chat.service.ts
import { io, Socket } from 'socket.io-client';
import { config } from '@/config/env';

export const createChatSocket = (): Socket => {
  return io(config.api.baseUrl, {
    auth: {
      token: localStorage.getItem('auth_token'),
    },
  });
};

// src/features/chat/hooks.ts
export const useChat = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = createChatSocket();
    socketRef.current = socket;

    // Join conversation room
    socket.emit('join', { conversationId });

    // Listen for incoming messages
    socket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (text: string) => {
    socketRef.current?.emit('message', { conversationId, text });
  };

  return { messages, sendMessage };
};
```

### 4.3 Search & Filtering (Elasticsearch)

```typescript
// src/features/roommate/hooks.ts
export const useSearchRoommates = (query: string, filters?: FilterDTO) => {
  const [results, setResults] = useState<RoommateProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(async () => {
    setLoading(true);
    try {
      const data = await api.get<RoommateProfile[]>('/roommates/search', {
        params: { q: query, ...filters },
      });
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (query) {
      debouncedSearch();
    }
  }, [query, filters]);

  return { results, loading };
};
```

---

## Migration Checklist

### Week 1-2: Prepare Frontend
- [ ] Create feature API layers in `src/features/*/api.ts`
- [ ] Create feature hooks in `src/features/*/hooks.ts`
- [ ] Update components to use hooks instead of direct API calls
- [ ] Test with mock data

### Week 3: Connect Backend
- [ ] Backend team provides API documentation
- [ ] Update `.env` files with backend URLs
- [ ] Run integration tests with real backend
- [ ] Fix any data mismatch issues

### Week 4+: Advanced Features
- [ ] Implement file uploads
- [ ] Add real-time chat
- [ ] Implement search/filtering
- [ ] Add analytics and monitoring

---

## Troubleshooting Common Issues

### Issue: CORS Errors

**Solution:** Configure CORS on backend
```
Access-Control-Allow-Origin: https://app.unissential.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Issue: Token Expiration

**Solution:** Already implemented in `src/services/api.ts`
```typescript
// Automatic token refresh on 401
client.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      return authService.refreshToken().then(() => {
        // Retry original request
      });
    }
  }
);
```

### Issue: Slow API Calls

**Solution:** Implement caching
```typescript
// src/lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>();

export const getCached = <T,>(key: string, maxAge: number): T | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < maxAge) {
    return cached.data;
  }
  return null;
};

export const setCache = <T,>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};
```

### Issue: Type Mismatches

**Solution:** Keep types in sync with backend
```typescript
// src/types/models/roommate.ts
// Keep in sync with backend OpenAPI schema
export interface RoommateProfile {
  id: string;
  name: string;
  age: number;
  // Always match backend
}
```

---

## Summary

| Phase | Timeline | Main Task | Components |
|-------|----------|-----------|-----------|
| 1 | Now | Frontend development | Use mock data |
| 2 | Wk 1-2 | API layer creation | No component changes |
| 3 | Wk 3 | Backend connection | Point to real API |
| 4 | Wk 4+ | Advanced features | File uploads, chat, search |

**Key Principle:** Components should never know if they're talking to mock data or real API. All API logic is abstracted in services and hooks.

---

*Last Updated: May 2026*
*Next.js 15 + TypeScript Architecture*
