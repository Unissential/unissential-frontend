# 🚀 Landing Page - Developer Guide

## Quick Start

### View the Landing Page
```bash
npm run dev
# Navigate to: http://localhost:3000/landing
```

### File Structure Reference

```
Landing Page Architecture:
├── Pages
│   └── src/app/landing/page.tsx              [Entry point - imports all sections]
│
├── Sections (Large, full-width components)
│   └── src/components/sections/
│       ├── HeroSection.tsx                   [Hero banner + main CTA]
│       ├── SearchSection.tsx                 [Advanced search form]
│       ├── FeaturedRoomsSection.tsx         [Room listings grid]
│       ├── RoommateMatchingSection.tsx      [Roommate profiles]
│       ├── MarketplaceSection.tsx           [Marketplace items]
│       ├── HowItWorksSection.tsx            [4-step guide]
│       ├── TestimonialsSection.tsx          [User testimonials]
│       ├── CTASection.tsx                   [Final CTA]
│       ├── Footer.tsx                       [Footer with links]
│       └── index.ts                         [Barrel export]
│
├── Reusable Components
│   └── src/components/common/
│       ├── Button.tsx                        [CTA button - 4 variants]
│       ├── Badge.tsx                         [Label badge - 5 types]
│       ├── RoomCard.tsx                      [Room listing card]
│       ├── RoommateCard.tsx                  [Roommate profile card]
│       ├── MarketplaceCard.tsx               [Marketplace item card]
│       └── index.ts                          [Barrel export]
│
├── Data & Types
│   ├── src/data/landing-mock.ts              [All mock data (mock-able)]
│   └── src/types/landing.ts                  [TypeScript interfaces]
│
└── Documentation
    ├── docs/LANDING_PAGE.md                  [Feature overview]
    ├── docs/LANDING_CUSTOMIZATION.md         [How to customize]
    └── docs/LANDING_DEVELOPER.md             [This file]
```

---

## 🔧 Development Workflow

### 1. Editing Sections

Each section is independent and self-contained:

```typescript
// Example: Editing HeroSection
export const HeroSection: React.FC = () => {
  return (
    <section className="relative px-4 py-20">
      {/* Content */}
    </section>
  );
};
```

**Tips**:
- Sections should be **responsive** (mobile-first)
- Use `max-w-7xl` for content width
- Add `border-t` separator before importing
- Include proper `id` for navigation

---

### 2. Adding Mock Data

Edit `src/data/landing-mock.ts`:

```typescript
// Add new data
export const newFeature: NewType[] = [
  {
    id: '1',
    title: 'Example',
    // ... properties
  },
];
```

Update component:
```typescript
// src/components/sections/NewSection.tsx
import { newFeature } from '@/data/landing-mock';

{newFeature.map((item) => (
  // Render
))}
```

---

### 3. Creating New Components

### Reusable Component Template

```typescript
// src/components/common/NewComponent.tsx
import React from 'react';

interface NewComponentProps {
  title: string;
  onClick?: () => void;
  // ... other props
}

export const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onClick,
}) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-neutral-800">
      <h3 className="font-bold text-neutral-900 dark:text-white">
        {title}
      </h3>
      {/* Content */}
    </div>
  );
};
```

Add to barrel export:
```typescript
// src/components/common/index.ts
export { NewComponent } from './NewComponent';
```

---

## 📋 Extending Functionality

### Add API Integration

Replace mock data with API calls:

```typescript
// src/services/landing.service.ts
import { api } from '@/services/api';
import type { Room } from '@/types/landing';

export const getRooms = async () => {
  const response = await api.get<Room[]>('/api/rooms');
  return response.data;
};
```

Update section:
```typescript
// src/components/sections/FeaturedRoomsSection.tsx
import { getRooms } from '@/services/landing.service';

export const FeaturedRoomsSection: React.FC = () => {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getRooms().then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    // ... render rooms
  );
};
```

---

### Add Animation Effects

Use Framer Motion (pre-installed):

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.1 }}
  viewport={{ once: true, margin: '-100px' }}
>
  {/* Your content */}
</motion.div>
```

---

### Add Form Handling

```typescript
import { useRouter } from 'next/navigation';

export const SearchSection: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    location: '',
    budget: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.location) {
      alert('Please enter a location');
      return;
    }

    // Navigate to results
    router.push(
      `/search?location=${formData.location}&budget=${formData.budget}`
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

## 🎯 Best Practices

### 1. Component Organization

✅ **Do**:
```typescript
// Keep sections focused on display
// Put data fetching in useEffect or custom hooks

// Section is just a view
export const Section = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return <div>{/* Render */}</div>;
};
```

❌ **Don't**:
```typescript
// Don't mix complex logic in sections
// Don't mutate state directly
// Don't have nested components in sections
```

---

### 2. Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | PascalCase | `HeroSection`, `RoomCard` |
| Functions | camelCase | `handleSubmit`, `fetchRooms` |
| Constants | UPPER_SNAKE | `MAX_ITEMS`, `API_URL` |
| Interfaces | PascalCase | `Room`, `Testimonial` |
| Files | PascalCase | `HeroSection.tsx` |
| Styles | Tailwind | `bg-primary-600` |

---

### 3. Type Safety

Always use TypeScript types:

```typescript
// ✅ Good
interface Props {
  rooms: Room[];
  onSelect: (id: string) => void;
}

export const RoomList: React.FC<Props> = ({ rooms, onSelect }) => {
  // ...
};

// ❌ Avoid
export const RoomList = ({ rooms, onSelect }: any) => {
  // ...
};
```

---

### 4. Responsive Design

Mobile-first approach:

```typescript
// Start with mobile (no prefix)
// Then add tablet (md:)
// Then add desktop (lg:)

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
  {/* 1 col mobile, 2 tablet, 4 desktop */}
</div>
```

---

### 5. Dark Mode Support

Always include dark mode variants:

```typescript
// ✅ Include dark: variants
<div className="bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white">

// ❌ Don't forget dark mode
<div className="bg-white text-neutral-900">
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1440px width)
- [ ] Test dark mode toggle
- [ ] Test all interactive elements (buttons, forms, links)
- [ ] Test hover effects
- [ ] Test navigation between sections
- [ ] Test form validation
- [ ] Test loading states
- [ ] Check accessibility (keyboard navigation, screen reader)

---

## 🐛 Debugging Tips

### Common Issues

**Issue**: Cards not displaying in grid
```typescript
// Check grid classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//     ↑ Ensure gap-* is set
```

**Issue**: Dark mode not working
```typescript
// Check tailwind.config.js
module.exports = {
  darkMode: 'class', // ← Needed for dark mode
  // ...
};
```

**Issue**: Styles not applying
```typescript
// Clear build cache
rm -rf .next
npm run dev
```

---

## 📊 Performance Optimization

### 1. Code Splitting

```typescript
// Use dynamic imports for heavy sections
import dynamic from 'next/dynamic';

const HeavySection = dynamic(
  () => import('./HeavySection'),
  { loading: () => <div>Loading...</div> }
);
```

### 2. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={600}
  height={400}
  loading="lazy"
  placeholder="blur"
  blurDataURL="..." // Optional blur effect
/>
```

### 3. Memoization

```typescript
import { memo } from 'react';

// Prevent re-renders of expensive components
export const RoomCard = memo(({ room }: Props) => {
  return (/* render */);
});
```

---

## 🔍 SEO Optimization

### 1. Metadata

```typescript
// src/app/landing/layout.tsx
export const metadata = {
  title: 'Unissential - Find Student Housing',
  description: 'Discover rooms, connect with roommates, and buy/sell textbooks on Unissential.',
};
```

### 2. Semantic HTML

```typescript
// Use semantic elements
<section>          {/* Section breaks */}
<article>          {/* Self-contained content */}
<aside>            {/* Related content */}
<nav>              {/* Navigation */}
<header>           {/* Introductory content */}
<footer>           {/* Footer content */}
<h1>, <h2>, <h3>  {/* Heading hierarchy */}
```

### 3. Schema Markup

```typescript
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Unissential",
  "description": "Student housing platform",
})}
</script>
```

---

## 🚀 Deployment

### Build Production

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel deploy --prod
```

### Deploy to AWS Amplify

```bash
amplify init
amplify publish
```

---

## 📚 Component API Reference

### Button Component
```typescript
<Button
  variant="primary" | "secondary" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  fullWidth={boolean}
  loading={boolean}
  onClick={() => void}
>
  Label
</Button>
```

### Badge Component
```typescript
<Badge
  variant="default" | "primary" | "success" | "warning" | "danger"
  size="sm" | "md" | "lg"
>
  Label
</Badge>
```

### RoomCard Component
```typescript
<RoomCard
  room={Room}
  onViewDetails={(id: string) => void}
/>
```

### RoommateCard Component
```typescript
<RoommateCard
  roommate={Roommate}
  onConnect={(id: string) => void}
/>
```

### MarketplaceCard Component
```typescript
<MarketplaceCard
  item={MarketplaceItem}
  onViewItem={(id: string) => void}
/>
```

---

## 🔗 Useful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check

# Run type check and lint together
npm run lint:fix
```

---

## 📖 Related Documentation

- [LANDING_PAGE.md](./LANDING_PAGE.md) - Feature overview
- [LANDING_CUSTOMIZATION.md](./LANDING_CUSTOMIZATION.md) - Customization guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - Overall project architecture
- [QUICK_REFERENCE.md](../QUICK_REFERENCE.md) - Quick reference

---

## 🤝 Contributing

When adding features to the landing page:

1. **Create feature branch**: `git checkout -b feature/landing-new-section`
2. **Make changes**: Update components, data, or types
3. **Test thoroughly**: Check mobile, tablet, desktop, and dark mode
4. **Update documentation**: Add to relevant docs
5. **Commit with message**: `git commit -m "feat: add new landing section"`
6. **Push and create PR**: `git push origin feature/...`

---

## 💡 Pro Tips

1. **Use Tailwind playground**: [play.tailwindcss.com](https://play.tailwindcss.com) for quick CSS prototyping
2. **Inspect with DevTools**: Right-click → Inspect for debugging styles
3. **Use React DevTools**: Browser extension for component debugging
4. **Keep mock data fresh**: Update data for demo purposes
5. **Test with real users**: Get feedback on landing page effectiveness
6. **Monitor analytics**: Track which sections have highest engagement

---

## 📞 Support & Resources

- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React Docs**: [react.dev](https://react.dev)
- **Next.js Docs**: [nextjs.org](https://nextjs.org)
- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)

---

**Last Updated**: May 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
