'use client';

import { useState, useEffect } from 'react';

/**
 * Generic localStorage hook — reads and persists a value in localStorage.
 */
export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [key, storedValue]);

  const setValue = (value: T) => {
    setStoredValue(value);
  };

  return [storedValue, setValue];
};
