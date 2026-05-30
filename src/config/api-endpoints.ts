// src/config/api-endpoints.ts
// Centralized API endpoint definitions

export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    verifyEmail: '/auth/verify-email',
    resetPassword: '/auth/reset-password',
  },

  // User endpoints
  users: {
    profile: '/users/profile',
    updateProfile: '/users/profile',
    settings: '/users/settings',
    updateSettings: '/users/settings',
    avatar: '/users/avatar',
  },

  // Roommate endpoints
  roommates: {
    list: '/roommates',
    create: '/roommates',
    detail: (id: string) => `/roommates/${id}`,
    update: (id: string) => `/roommates/${id}`,
    delete: (id: string) => `/roommates/${id}`,
    search: '/roommates/search',
    compatibility: (id: string) => `/roommates/${id}/compatibility`,
  },

  // Leasing endpoints
  leasing: {
    list: '/leasing',
    create: '/leasing',
    detail: (id: string) => `/leasing/${id}`,
    update: (id: string) => `/leasing/${id}`,
    delete: (id: string) => `/leasing/${id}`,
    search: '/leasing/search',
  },

  // Marketplace endpoints
  marketplace: {
    list: '/marketplace',
    create: '/marketplace',
    detail: (id: string) => `/marketplace/${id}`,
    update: (id: string) => `/marketplace/${id}`,
    delete: (id: string) => `/marketplace/${id}`,
    search: '/marketplace/search',
  },

  // Chat endpoints
  chat: {
    conversations: '/chat/conversations',
    messages: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    sendMessage: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
    createConversation: '/chat/conversations',
  },

  // Upload endpoints
  upload: {
    single: '/upload/single',
    multiple: '/upload/multiple',
    profile: '/upload/profile',
  },
} as const;

// Helper to build full URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  return `${baseUrl}${endpoint}`;
};
