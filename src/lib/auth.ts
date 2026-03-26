import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Generate a unique ID.
 */
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

/**
 * Hash a password using bcrypt.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a plain-text password against a bcrypt hash.
 */
export const verifyPassword = async (plain: string, stored: string): Promise<boolean> => {
  return bcrypt.compare(plain, stored);
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
