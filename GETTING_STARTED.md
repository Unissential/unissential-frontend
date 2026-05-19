# 🚀 Unissential Frontend - Getting Started

## Project Successfully Created ✨

Your production-grade frontend foundation is ready! Here's everything you need to know to get started.

## ⚡ Quick Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Check for linting issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changes
```

## 📁 Project Structure at a Glance

```
Unissential/
├── public/              # Static assets (images, fonts, etc.)
├── src/
│   ├── app/            # Next.js App Router (pages, layouts)
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── layout/     # Layout components (Navbar, Footer)
│   │   └── shared/     # Shared components
│   ├── features/       # Feature-specific code
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions & helpers
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   └── types/          # TypeScript types
├── .eslintrc.json      # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
├── next.config.js      # Next.js configuration
└── package.json        # Project dependencies
```

## 🎯 Key Features Already Configured

✅ **Next.js 15** with App Router  
✅ **React 19** with TypeScript  
✅ **Tailwind CSS** with theme customization  
✅ **Responsive Navbar** with mobile menu  
✅ **Modern Footer** with multi-column layout  
✅ **Hero Section** on homepage  
✅ **Production-grade UI Components**:
  - Button (4 variants, 3 sizes)
  - Card (with hover states)
  - Badge (6 variants)
  - Container (responsive)

✅ **Custom Hooks**:
  - `useToggle` - Boolean state management
  - `useLocalStorage` - Persistent state
  - `useOutsideClick` - Click detection

✅ **Utility Functions**:
  - `cn()` - Tailwind class merging
  - `formatCurrency()` - Currency formatting
  - `formatDate()` - Date formatting
  - `truncateText()` - Text truncation
  - `debounce()` - Performance optimization

✅ **API Service** - Ready for backend integration  
✅ **Absolute Imports** - Clean import paths  
✅ **ESLint + Prettier** - Code quality  
✅ **Responsive Design** - Mobile-first approach

## 🎨 UI/UX Highlights

The design system includes:

- **Color Palette**: Primary (Purple), Secondary (Violet), Neutral (Gray), Semantic (Success, Warning, Error)
- **Typography**: Carefully tuned font sizes and line heights
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions and fade-in effects
- **Accessibility**: Proper color contrast and focus states

## 🔧 Customization Guide

### Add a New Page

1. Create file in `src/app/` folder
2. Use dynamic routes: `src/app/about/page.tsx`
3. Layouts automatically nest

```typescript
export default function AboutPage() {
  return <div>Your content here</div>;
}
```

### Add a New UI Component

1. Create in `src/components/ui/ComponentName.tsx`
2. Export from `src/components/ui/index.ts`
3. Use in pages with: `import { ComponentName } from '@/ui/ComponentName'`

### Create a New Feature

1. Create folder: `src/features/featureName/`
2. Organize: `components/`, `hooks/`, `types/`, `utils/`
3. Export main component from `index.ts`
4. See [src/features/EXAMPLE.md](src/features/EXAMPLE.md) for detailed structure

### Update Theme Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#a855ff',
        700: '#9333ea',
        // ... other shades
      }
    }
  }
}
```

### Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Update values for your environment:

```env
NEXT_PUBLIC_API_URL=https://your-api.com
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

## 📚 Import Paths Reference

```typescript
// ✅ Always use absolute imports
import { Button } from '@/ui/Button';
import { Navbar } from '@/components/layout';
import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/lib/utils';
import { API_CONFIG } from '@/lib/constants';
import { apiService } from '@/services/api';
import type { User } from '@/types';

// ❌ Avoid relative imports
// import { Button } from '../../../components/ui/Button';
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to https://vercel.com/new
# 3. Select your repository
# 4. Configure environment variables
# 5. Deploy!
```

### Deploy with Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./next
COPY --from=builder /app/public ./public
COPY package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Best Practices

- ✅ Use TypeScript strictly (no `any` types)
- ✅ Keep components small and focused
- ✅ Extract logic into custom hooks
- ✅ Use absolute imports for clean code
- ✅ Add JSDoc comments for complex functions
- ✅ Follow naming conventions (PascalCase for components)
- ✅ Format before committing: `npm run format && npm run lint:fix`
- ✅ Test responsive design on mobile/tablet

## 📖 Documentation

- [README.md](README.md) - Full project documentation
- [Development Guidelines](.github/copilot-instructions.md) - Code standards
- [Feature Structure](src/features/EXAMPLE.md) - How to create features
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind Docs](https://tailwindcss.com/docs)

## 🆘 Troubleshooting

### "Cannot find module" errors
- Use absolute imports: `@/lib/utils` not `../lib/utils`
- Check imports in `tsconfig.json`
- Restart dev server

### Tailwind styles not applying
- Run `npm run build` to compile
- Check class names spelling
- Use `cn()` utility for conditional classes

### TypeScript errors
- Run `npm run lint:fix` to auto-fix
- Check type definitions in `src/types/`
- Ensure all props are properly typed

### Port 3000 already in use
```bash
# Use a different port
npm run dev -- -p 3001
```

## 🎓 Next Steps

1. **Customize the theme** - Update colors in `tailwind.config.js`
2. **Create features** - Follow pattern in `src/features/EXAMPLE.md`
3. **Add API calls** - Use `apiService` from `src/services/api.ts`
4. **Build pages** - Create routes in `src/app/`
5. **Deploy** - Push to GitHub and deploy to Vercel

## 💡 Pro Tips

- Use `'use client'` directive only when you need interactivity
- Leverage Server Components for better performance
- Use dynamic imports for code splitting
- Cache API responses using `revalidate` in page.tsx
- Use images with Next.js `Image` component for optimization

## 📞 Support

For issues or questions:
- Check [README.md](README.md)
- Review examples in [src/features/EXAMPLE.md](src/features/EXAMPLE.md)
- Check [Next.js Documentation](https://nextjs.org/docs)

---

**Ready to build?** Run `npm run dev` and start creating! 🎉
