<!-- Use this file to provide workspace-specific custom instructions to Copilot. -->

# Unissential Frontend Development Guidelines

## Project Overview

- **Project**: Unissential Frontend
- **Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS, App Router
- **Status**: Production-grade foundation ready for feature development

## Architecture Principles

1. **Modular Structure**: Components organized by responsibility (ui, layout, features)
2. **Type Safety**: Full TypeScript implementation with strict typing
3. **Reusability**: Maximize component reuse across features
4. **Scalability**: Folder structure supports enterprise-level growth
5. **Performance**: Optimized with Turbopack and Next.js best practices

## Absolute Import Paths

Always use absolute imports:

```typescript
// ✅ Correct
import { Button } from '@/ui/Button';
import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/lib/utils';

// ❌ Avoid
import { Button } from '../../../components/ui/Button';
```

## Component Guidelines

### UI Components (`src/components/ui/`)

- Keep components simple and focused
- Support common variants and sizes
- Extend React HTML attributes for flexibility
- Use `cn()` utility for Tailwind class merging

### Layout Components (`src/components/layout/`)

- Use for global page structure (Navbar, Footer)
- Keep minimal business logic
- Accept composition for flexibility

### Feature Components (`src/features/`)

- Organize by feature domain
- Include feature-specific hooks, utils, types
- Keep components modular and testable

## Development Workflow

1. **Start dev server**: `npm run dev`
2. **Format code**: `npm run format` before commits
3. **Lint check**: `npm run lint:fix` to catch issues
4. **Build test**: `npm run build` before pushing

## Code Quality Standards

- Use TypeScript strictly (no `any` types)
- Follow naming conventions (PascalCase for components)
- Add JSDoc comments for complex functions
- Minimize component dependencies
- Extract reusable logic into custom hooks

## Styling

- Use Tailwind CSS utility classes
- Reference theme values from `tailwind.config.js`
- Use `cn()` utility to merge conflicting classes
- Keep component styles co-located with components

## Performance Optimizations

- Use `'use client'` only when necessary
- Leverage Server Components by default
- Optimize images with Next.js Image component
- Use dynamic imports for code splitting

## Testing & Quality

- Ensure TypeScript compilation passes
- Run linter before commits
- Test responsive design on mobile/tablet
- Validate accessibility standards

## File Naming

- Components: PascalCase (Button.tsx, UserCard.tsx)
- Utilities/Hooks: camelCase (useToggle.ts, formatDate.ts)
- Types: PascalCase (User.ts, APIResponse.ts)
- Constants: UPPER_CASE (API_BASE_URL, DEFAULT_TIMEOUT)

## Common Tasks

### Add New UI Component

1. Create file in `src/components/ui/ComponentName.tsx`
2. Export from `src/components/ui/index.ts`
3. Follow Button pattern for consistency

### Add New Feature

1. Create folder in `src/features/featureName/`
2. Organize with: components/, hooks/, types/, utils/
3. Export main component from index.ts

### Add Custom Hook

1. Create file in `src/hooks/useHookName.ts`
2. Export from `src/hooks/index.ts`
3. Add JSDoc documentation

### Update Tailwind Theme

Edit `tailwind.config.js`:
- Colors in theme.extend.colors
- Spacing in theme.extend.spacing
- Custom utilities in plugins array

## Troubleshooting

- **TypeScript errors**: Run `npm run lint:fix`
- **Style conflicts**: Use `cn()` utility for Tailwind merging
- **Build failures**: Check for unresolved imports using absolute paths
- **Hot reload issues**: Clear `.next` directory and restart dev server

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Component Best Practices](README.md)
- [Tailwind Config](tailwind.config.js)
- [TypeScript Config](tsconfig.json)
