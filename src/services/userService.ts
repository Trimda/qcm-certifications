import type { User } from '@/types';

const BASE_URL = '/api/users';

/** Fetch all users (admin only) */
export const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json() as Promise<User[]>;
};

/** Update a user by ID */
export const updateUser = async (id: string, updates: Partial<User>): Promise<User> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update user: ${id}`);
  return res.json() as Promise<User>;
};

/** Delete a user by ID */
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete user: ${id}`);
};

/** Login */
export const loginUser = async (email: string, password: string): Promise<User> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json() as { error?: string };
    throw new Error(data.error ?? 'Login failed');
  }
  return res.json() as Promise<User>;
};

/** Register */
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  role: string
): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, role }),
  });
  if (!res.ok) {
    const data = await res.json() as { error?: string };
    throw new Error(data.error ?? 'Registration failed');
  }
  return res.json() as Promise<User>;
};

/** Logout */
export const logoutUser = async (): Promise<void> => {
  await fetch('/api/auth/logout', { method: 'POST' });
};
