# Quick Reference Guide

## 🎯 Common Import Patterns

```typescript
// UI Components
import { Button, Card, Badge, Container } from '@/ui';

// Layout Components
import { Navbar, Footer } from '@/components/layout';

// Custom Hooks
import { useToggle, useLocalStorage, useOutsideClick } from '@/hooks';

// Utilities
import { cn, formatCurrency, formatDate, truncateText } from '@/lib/utils';
import { API_CONFIG, PAGINATION, ROUTES } from '@/lib/constants';
import { theme } from '@/lib/theme';

// Services
import { apiService } from '@/services/api';

// Types
import type { User, APIResponse, NavItem, Product } from '@/types';
```

## 🏗️ Creating a New Feature

```bash
# 1. Create feature folder
mkdir -p src/features/myfeature/{components,hooks,types,utils}

# 2. Create feature structure
src/features/myfeature/
├── components/
│   ├── MyFeatureComponent.tsx
│   └── index.ts
├── hooks/
│   ├── useMyFeature.ts
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── helpers.ts
└── index.ts  # Main export
```

## 📄 Creating a New Page

```typescript
// src/app/mypage/page.tsx
import { Container } from '@/ui/Container';

export const metadata = {
  title: 'My Page - Unissential',
  description: 'Page description',
};

export default function MyPage() {
  return (
    <Container>
      <h1>My Page</h1>
      {/* Your content */}
    </Container>
  );
}
```

## 🧩 Creating a New Component

```typescript
// src/components/ui/MyComponent.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-styles',
          variant === 'primary' ? 'primary-styles' : 'secondary-styles',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';

// src/components/ui/index.ts
export { MyComponent } from './MyComponent';
```

## 🪝 Creating a Custom Hook

```typescript
// src/hooks/useMyHook.ts
import { useState, useCallback } from 'react';

interface UseMyHookReturn {
  value: string;
  setValue: (value: string) => void;
}

export function useMyHook(): UseMyHookReturn {
  const [value, setValue] = useState('');

  return { value, setValue };
}

// src/hooks/index.ts
export { useMyHook } from './useMyHook';
```

## 📡 Making API Calls

```typescript
// Using apiService
import { apiService } from '@/services/api';
import type { User } from '@/types';

// GET request
const response = await apiService.get<User[]>('/users');
if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}

// POST request
const response = await apiService.post<User>('/users', {
  name: 'John',
  email: 'john@example.com',
});

// In a custom hook
import { useState } from 'react';
import { apiService } from '@/services/api';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.get('/users');
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { users, isLoading, error, fetchUsers };
}
```

## 🎨 Working with Styles

```typescript
// Using cn() for conditional styles
import { cn } from '@/lib/utils';

<button
  className={cn(
    'base-styles',
    isActive && 'active-styles',
    size === 'large' && 'large-styles'
  )}
>
  Click me
</button>

// Using Tailwind directly
<div className="flex items-center justify-between px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-smooth">
  Content
</div>

// Custom theme colors from tailwind.config.js
theme-extend colors: primary, secondary, success, warning, error, neutral
```

## 🔄 Using Custom Hooks

```typescript
'use client';

import { useToggle } from '@/hooks/useToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function MyComponent() {
  // Toggle hook
  const { isOpen, toggle, open, close } = useToggle(false);

  // Local storage hook
  const [name, setName] = useLocalStorage('userName', '');

  return (
    <div>
      <button onClick={toggle}>
        {isOpen ? 'Hide' : 'Show'}
      </button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
    </div>
  );
}
```

## ✅ Code Quality Workflow

```bash
# 1. Make changes to src/
# 2. Format code
npm run format

# 3. Fix linting issues
npm run lint:fix

# 4. Check build locally
npm run build

# 5. Commit only after all checks pass
git add .
git commit -m "Add feature description"
git push
```

## 🚀 Deployment Checklist

```bash
# 1. Ensure build succeeds
npm run build

# 2. Test locally
npm run dev
# Visit http://localhost:3000

# 3. Push to GitHub
git push origin main

# 4. Deploy to Vercel
# - Go to vercel.com
# - Connect repo
# - Configure env vars
# - Deploy!

# OR use Vercel CLI
npm i -g vercel
vercel
```

## 📊 Environment Variables

```env
# .env.local (local development)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.unissential.com

# Access in code
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Use in components/client code only (NEXT_PUBLIC_ prefix required)
const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/data`);
```

## 🎯 Performance Tips

```typescript
// ✅ Use Server Components by default
// No 'use client' needed
export default function Page() {
  return <div>Server rendered</div>;
}

// ✅ Use dynamic imports for large components
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'));

// ✅ Optimize images
import Image from 'next/image';
<Image src="/image.png" alt="alt" width={500} height={500} />

// ✅ Use revalidate for ISR
export const revalidate = 60; // Revalidate every 60 seconds

// ❌ Avoid 'use client' unless needed
// ❌ Don't fetch data in components
// ❌ Don't use large libraries on client side
```

## 🔍 Debugging Tips

```typescript
// Enable debug logging
console.log('Debug:', variable);

// Type checking
import type { User } from '@/types';
const user: User = { /* ... */ };

// Check build
npm run build  // Shows all errors before deployment

// Check linting
npm run lint   // Shows all linting issues

// Clear Next.js cache
rm -rf .next
npm run dev
```

## 📚 File Location Reference

| File Type | Location |
|-----------|----------|
| Pages | `src/app/page.tsx` |
| Components | `src/components/ui/` |
| Layouts | `src/components/layout/` |
| Features | `src/features/name/` |
| Hooks | `src/hooks/` |
| Utils | `src/lib/` |
| Types | `src/types/` |
| Services | `src/services/` |
| Styles | `src/styles/` |
| Public assets | `public/` |

---

**Remember**: Always use absolute imports and keep your code clean and well-typed! 🎉
