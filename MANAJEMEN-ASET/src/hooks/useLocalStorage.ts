import { useState } from "react";

/**
 * Hook custom untuk menyimpan dan membaca data dari localStorage.
 * @param key - Nama key yang digunakan di localStorage
 * @param initialValue - Nilai awal jika belum ada di localStorage
 * @returns [value, setValue] seperti useState, tapi terhubung dengan localStorage
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("❌ Error reading from localStorage:", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("❌ Error writing to localStorage:", error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
