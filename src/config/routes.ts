// src/config/routes.ts
// Centralized route definitions for type-safe navigation

export const routes = {
  // Public pages
  home: '/',

  // Auth routes
  auth: {
    login: '/login',
    signup: '/signup',
    verifyEmail: '/verify-email',
    resetPassword: '/reset-password',
  },

  // Dashboard routes
  dashboard: {
    home: '/dashboard',
  },

  // Roommate feature
  roommates: {
    discover: '/roommates',
    detail: (id: string) => `/roommates/${id}`,
    create: '/roommates/create',
    profile: '/roommates/profile',
  },

  // Leasing feature
  leasing: {
    browse: '/leasing',
    detail: (id: string) => `/leasing/${id}`,
    post: '/leasing/post',
  },

  // Marketplace feature
  marketplace: {
    browse: '/marketplace',
    detail: (id: string) => `/marketplace/${id}`,
    post: '/marketplace/post',
  },

  // Chat feature
  chat: {
    conversations: '/chat',
    conversation: (id: string) => `/chat/${id}`,
  },

  // Settings
  settings: {
    account: '/settings/account',
    privacy: '/settings/privacy',
    notifications: '/settings/notifications',
  },

  // Legal
  legal: {
    terms: '/terms',
    privacy: '/privacy',
    contact: '/contact',
  },
} as const;

// Helper function for type-safe route checking
export const isProtectedRoute = (path: string): boolean => {
  const publicRoutes = [
    routes.home,
    routes.auth.login,
    routes.auth.signup,
    routes.auth.verifyEmail,
    routes.auth.resetPassword,
    routes.legal.terms,
    routes.legal.privacy,
    routes.legal.contact,
  ];

  return !publicRoutes.some((route) => typeof route === 'string' && route === path);
};
