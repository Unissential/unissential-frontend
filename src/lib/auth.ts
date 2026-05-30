/**
 * Authentication and Authorization Guards
 * Protects dashboard routes and manages user sessions
 */

import { ReactNode } from 'react';

/**
 * Check if user is authenticated
 * In production, this would verify a JWT token or session
 */
export function isAuthenticated(): boolean {
  // For development, always return true
  // In production, check localStorage or auth context
  if (typeof window === 'undefined') return false;

  const authToken = localStorage.getItem('auth_token');
  return !!authToken;
}

/**
 * Get current authenticated user
 * In production, decode JWT or fetch from session
 */
export function getCurrentUser() {
  if (typeof window === 'undefined') return null;

  const userJson = localStorage.getItem('current_user');
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Set authentication token (called after login)
 */
export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
}

/**
 * Clear authentication (called on logout)
 */
export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
}

/**
 * Initialize demo auth (for development)
 */
export function initDemoAuth() {
  if (typeof window === 'undefined') return;

  const demoToken = 'demo_token_' + Date.now();
  const demoUser = {
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@utexas.edu',
    university: 'UT Austin',
  };

  localStorage.setItem('auth_token', demoToken);
  localStorage.setItem('current_user', JSON.stringify(demoUser));
}
