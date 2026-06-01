import { useState, useCallback } from 'react';

interface UseToggleReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

/**
 * Custom hook for toggling boolean state
 */
export function useToggle(initialState: boolean = false): UseToggleReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, toggle, open, close };
}
