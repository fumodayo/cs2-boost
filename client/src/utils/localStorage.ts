export const setLocalStorage = <T>(key: string, value: T): void => {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);

    if (storedValue === null) {
      return defaultValue;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};
