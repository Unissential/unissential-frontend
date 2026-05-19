import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for managing local storage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Return a wrapped version of useState's setter function that persists
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error('Error storing value in localStorage:', error);
      }
    },
    [key, storedValue]
  );

  // Load initial value from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.error('Error retrieving value from localStorage:', error);
    }
  }, [key]);

  return [storedValue, setValue] as const;
}
