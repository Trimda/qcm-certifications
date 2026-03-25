/**
 * Generate a unique ID.
 */
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Simple password comparison for local dev.
 * For production, replace with bcrypt or similar.
 */
export const hashPassword = (password: string): string => {
  // For local dev only — plain text storage
  return password;
};

/**
 * Verify a plain-text password against a stored value.
 */
export const verifyPassword = (plain: string, stored: string): boolean => {
  return plain === stored;
};

/** Cookie name used for session storage */
export const SESSION_COOKIE = 'qcm_session';

/**
 * Parse the session cookie value to get userId.
 */
export const parseSessionCookie = (cookieValue: string): string | null => {
  try {
    const decoded = atob(cookieValue);
    const parsed = JSON.parse(decoded) as { userId?: string };
    return parsed?.userId ?? null;
  } catch {
    return null;
  }
};

/**
 * Create an encoded session cookie value from userId.
 */
export const createSessionValue = (userId: string): string => {
  return btoa(JSON.stringify({ userId }));
};
