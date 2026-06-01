'use client';

import { useEffect, useState } from 'react';
import { isAuthenticated, getCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if user is authenticated
 * Redirects to login if not authenticated
 */
export function useAuthGuard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return { isLoading };
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  return { user, isLoading };
}

/**
 * Hook to manage saved items
 */
export function useSavedItems() {
  const [savedItems, setSavedItems] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('saved_items');
    if (saved) {
      setSavedItems(JSON.parse(saved));
    }
  }, []);

  const toggleSave = (itemId: string) => {
    setSavedItems((prev) => {
      const updated = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      localStorage.setItem('saved_items', JSON.stringify(updated));
      return updated;
    });
  };

  const isSaved = (itemId: string) => savedItems.includes(itemId);

  return { savedItems, toggleSave, isSaved };
}

/**
 * Hook to manage dashboard state
 */
export function useDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(3);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return {
    sidebarOpen,
    toggleSidebar,
    unreadCount,
    setUnreadCount,
  };
}
