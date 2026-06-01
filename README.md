# Unissential Frontend

A production-grade frontend foundation for the Unissential startup, built with modern technologies and best practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (Recommended: 20 LTS)
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser and navigate to http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/                # Reusable UI components (Button, Card, etc.)
│   ├── layout/            # Layout components (Navbar, Footer)
│   └── shared/            # Shared components across features
├── features/              # Feature-specific modules
│   └── README.md          # Feature organization guide
├── hooks/                 # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useToggle.ts
│   └── useOutsideClick.ts
├── lib/                   # Utility functions
│   └── utils.ts           # Shared utilities (cn, formatters, etc.)
├── services/              # API services and external integrations
│   └── api.ts             # API client service
├── styles/                # Global styles
│   └── globals.css        # Tailwind CSS setup
└── types/                 # TypeScript type definitions
    └── index.ts           # Shared types
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Turbopack (via Next.js)
- **Icons**: Lucide React
- **Code Quality**: ESLint, Prettier
- **Utilities**: clsx, tailwind-merge

## 🎨 Design System

### Colors

The design system includes carefully selected color palettes:

- **Primary**: Purple gradient (600-900)
- **Secondary**: Violet gradient (600-900)
- **Neutral**: Grayscale (50-900)
- **Semantic**: Success, Warning, Error

### Components

#### UI Components (`src/components/ui/`)

- **Button**: Multi-variant button component
  - Variants: `primary`, `secondary`, `outline`, `ghost`
  - Sizes: `sm`, `md`, `lg`

- **Container**: Responsive container with max-width constraints
  - Sizes: `sm`, `md`, `lg`, `xl`, `2xl`, `full`

- **Card**: Flexible card component with optional hover effects
- **Badge**: Status badge with multiple variants

#### Layout Components (`src/components/layout/`)

- **Navbar**: Responsive navigation with mobile menu
- **Footer**: Multi-column footer with links and branding

## 📚 Available Scripts

```bash
# Development
npm run dev           # Start dev server with hot reload

# Production
npm run build         # Build for production
npm start             # Start production server

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting without changes
```

## 🔧 Configuration

### Absolute Imports

Configured in `tsconfig.json`:

```typescript
// Instead of: import { Button } from '../../components/ui/Button'
// Use: import { Button } from '@/ui/Button'

import { Button } from '@/ui/Button';
import { useToggle } from '@/hooks/useToggle';
import { cn } from '@/lib/utils';
```

### Environment Variables

Create `.env.local` for local development:

```env
NEXT_PUBLIC_API_URL=https://api.unissential.com
```

### Tailwind CSS

Customization available in `tailwind.config.js`:
- Extended color palette
- Custom spacing
- Animation definitions
- Custom utilities via `@layer components`

## 🎯 Best Practices

### Component Organization

1. **UI Components**: Reusable, unstyled components (Button, Card, Input)
2. **Layout Components**: Global layout pieces (Navbar, Footer, Sidebar)
3. **Feature Components**: Domain-specific components organized by feature
4. **Shared Components**: Reusable components across features

### Naming Conventions

- **Components**: PascalCase (Button.tsx, UserProfile.tsx)
- **Hooks**: camelCase with `use` prefix (useToggle.ts, useAuth.ts)
- **Utilities**: camelCase (formatDate.ts, cn.ts)
- **Types**: PascalCase (User.ts, APIResponse.ts)

### File Organization

```
feature/
├── components/
│   ├── FeatureHeader.tsx
│   └── FeatureCard.tsx
├── hooks/
│   └── useFeature.ts
├── types/
│   └── index.ts
└── utils/
    └── helpers.ts
```

### TypeScript

All files should be fully typed:

```typescript
// ✅ Good
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  // ...
};

// ❌ Avoid
export const Button = ({ variant, ...props }: any) => {
  // ...
};
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository on Vercel
3. Set environment variables
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📖 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📝 Code Style

We use Prettier and ESLint for code formatting. Run before committing:

```bash
npm run format
npm run lint:fix
```

## 📄 License

This project is proprietary and confidential.

## 🎯 Next Steps

1. **Customize Colors**: Update Tailwind theme in `tailwind.config.js`
2. **Add Features**: Create feature folders in `src/features/`
3. **Build Pages**: Add routes in `src/app/`
4. **API Integration**: Implement API calls using `apiService`
5. **Authentication**: Set up auth flow in features/auth/

---

Built with ❤️ by the Unissential team
