# 🎨 Landing Page Customization Guide

## Quick Customization Examples

### 1. Change Brand Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        // ... adjust all 900 levels
      },
      secondary: {
        // ... your brand colors
      },
    },
  },
},
```

Update component usage:
```typescript
// All components automatically update
<Button className="bg-primary-600 hover:bg-primary-700" />
```

---

### 2. Modify Hero Section

Edit `src/components/sections/HeroSection.tsx`:

```typescript
// Change headline
<h1 className="text-6xl font-bold">
  Your Custom Headline Here
</h1>

// Change CTA button action
<Button onClick={() => router.push('/your-route')}>
  Custom Button Text
</Button>

// Change background decoration colors
<div className="bg-primary-200/30" /> {/* Adjust opacity/color */}
```

---

### 3. Add New Feature Cards

Edit `src/data/landing-mock.ts`:

```typescript
export const features: Feature[] = [
  {
    id: '7', // New ID
    title: 'Your New Feature',
    description: 'Feature description here',
    icon: 'YourIconName', // From lucide-react
    color: 'from-blue-500 to-cyan-500', // Gradient colors
  },
  // ...
];
```

Then update the component to display more cards:

```typescript
// In FeaturedSection or any section
{features.map((feature) => (
  <div key={feature.id}>
    {/* Render feature */}
  </div>
))}
```

---

### 4. Update Testimonials

Edit `src/data/landing-mock.ts`:

```typescript
export const testimonials: Testimonial[] = [
  {
    id: '5', // New ID
    author: 'New Student Name',
    role: 'Student Role',
    image: 'https://images.unsplash.com/...', // Your image URL
    content: 'Their testimonial text here...',
    rating: 5,
    school: 'University Name',
  },
  // ...
];
```

---

### 5. Customize Search Filters

Edit `src/components/sections/SearchSection.tsx`:

```typescript
// Add new filter options
<select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
  <option value="">All types</option>
  <option value="studio">Studio</option>
  <option value="1bed">1 Bedroom</option>
  <option value="2bed">2 Bedrooms</option>
  <option value="shared">Shared Room</option>
  <option value="your-new-type">Your New Type</option>
</select>

// Add custom handle search logic
const handleSearch = () => {
  // Your custom search logic
  console.log('Search:', { location, budget, roomType });
  // Maybe redirect to search results page
  // router.push(`/search?location=${location}&budget=${budget}`);
};
```

---

### 6. Modify Card Layouts

### Room Card Customization

Edit `src/components/common/RoomCard.tsx`:

```typescript
// Change card height
<div className="h-48"> {/* Change from 48 to your size */}

// Add new property
<p className="text-primary-600">New Property: {room.newField}</p>

// Customize amenities display
{room.amenities.slice(0, 3).map((amenity) => ( {/* Show 3 instead of 2 */}
  <span key={amenity}>{amenity}</span>
))}
```

---

### 7. Add Animation Effects

Use Framer Motion (already installed):

```typescript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  {/* Your content */}
</motion.div>
```

---

### 8. Change Responsive Breakpoints

Tailwind breakpoints usage:

```typescript
{/* Hide on mobile, show on desktop */}
<div className="hidden md:block">Desktop only</div>

{/* 1 column mobile, 2 tablet, 4 desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

{/* Full width mobile, auto desktop */}
<Button className="w-full md:w-auto">
```

---

### 9. Customize Typography

Edit component styles:

```typescript
// Change heading size
<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">

// Change text color gradient
<h1 className="text-transparent bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text">
  Your Headline
</h1>
```

---

### 10. Add New Section

Step-by-step:

1. **Create component**:
```typescript
// src/components/sections/NewSection.tsx
export const NewSection: React.FC = () => {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <h2>Your Section Title</h2>
        {/* Content */}
      </div>
    </section>
  );
};
```

2. **Add to barrel export**:
```typescript
// src/components/sections/index.ts
export { NewSection } from './NewSection';
```

3. **Use in landing page**:
```typescript
// src/app/landing/page.tsx
import { NewSection } from '@/components/sections';

export default function LandingPage() {
  return (
    <>
      {/* ... existing sections */}
      <section className="border-t">
        <NewSection />
      </section>
    </>
  );
}
```

---

## 🎯 Common Customization Tasks

### Change Section Title Color

```typescript
{/* Before: neutral-900 (dark) */}
<h2 className="text-neutral-900">

{/* After: primary-600 (branded) */}
<h2 className="text-primary-600">
```

---

### Add Hover Effects

```typescript
{/* Add scale animation */}
<div className="transition-transform duration-300 hover:scale-105">

{/* Add color change */}
<button className="hover:bg-primary-600 transition-colors">

{/* Add shadow */}
<div className="hover:shadow-2xl transition-shadow">
```

---

### Modify Button Styles

In `src/components/common/Button.tsx`:

```typescript
const variantStyles = {
  primary: 'bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-lg',
  // Add new variant
  gradient: 'bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600',
};
```

---

### Change Icon

Use Lucide icons:

```typescript
import { Star, Heart, Zap, // ... other icons
} from 'lucide-react';

{/* Use any icon */}
<MyIcon className="h-6 w-6 text-primary-600" />
```

[View all Lucide icons](https://lucide.dev)

---

### Add Form Validation

```typescript
const [email, setEmail] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});

const validateEmail = (email: string) => {
  if (!email.includes('@')) {
    setErrors({ email: 'Invalid email' });
    return false;
  }
  return true;
};

const handleSubmit = () => {
  if (validateEmail(email)) {
    // Submit form
  }
};
```

---

### Change Layout Grid

```typescript
{/* 2 columns on all screens */}
<div className="grid grid-cols-2">

{/* 2 mobile, 4 tablet, 6 desktop */}
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">

{/* Auto-fit (responsive) */}
<div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
```

---

### Add Image Background

```typescript
<section 
  className="relative bg-cover bg-center"
  style={{
    backgroundImage: 'url(https://images.unsplash.com/...)',
  }}
>
  {/* Add overlay for readability */}
  <div className="absolute inset-0 bg-black/50" />
  
  {/* Content */}
  <div className="relative z-10">
    {/* Your content here */}
  </div>
</section>
```

---

### Add Border Styling

```typescript
{/* Top border */}
<div className="border-t-2 border-primary-600">

{/* All borders rounded */}
<div className="rounded-2xl border-2 border-neutral-200">

{/* Gradient border effect */}
<div className="relative p-4 rounded-lg overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600" />
  <div className="relative bg-white dark:bg-neutral-900">
    Content
  </div>
</div>
```

---

## 🎨 Theme Customization

Create a theme by updating colors globally:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bae6ff',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c3d66',
        },
        secondary: {
          // Your secondary colors
        },
      },
    },
  },
};
```

---

## 📊 Data Structure Customization

### Add New Room Property

1. Update type:
```typescript
// src/types/landing.ts
interface Room {
  // ... existing fields
  parking?: boolean;
  petFriendly?: boolean;
  utilities?: string[];
}
```

2. Update mock data:
```typescript
// src/data/landing-mock.ts
const featuredRooms: Room[] = [
  {
    // ... existing fields
    parking: true,
    petFriendly: true,
    utilities: ['WiFi', 'Water', 'Electricity'],
  },
];
```

3. Display in component:
```typescript
// src/components/common/RoomCard.tsx
{room.parking && <p>🅿️ Parking Available</p>}
{room.petFriendly && <p>🐾 Pet Friendly</p>}
```

---

## 🚀 Performance Customization

### Lazy Load Images

```typescript
import Image from 'next/image';

<Image
  src={room.image}
  alt={room.title}
  width={600}
  height={400}
  loading="lazy"
/>
```

### Optimize Sections

```typescript
import dynamic from 'next/dynamic';

const HeavySection = dynamic(() => import('./HeavySection'), {
  loading: () => <div>Loading...</div>,
});
```

---

## 📱 Mobile-Specific Customization

```typescript
{/* Show/hide on mobile */}
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

{/* Different text sizes */}
<h1 className="text-3xl md:text-5xl lg:text-6xl">

{/* Different spacing */}
<div className="p-4 md:p-8 lg:p-12">

{/* Different layouts */}
<div className="flex flex-col md:flex-row">
```

---

## 🎓 Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

**Last Updated**: May 2026
**Version**: 1.0.0
