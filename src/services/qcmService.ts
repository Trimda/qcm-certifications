import type { Qcm, Topic } from '@/types';

const BASE_URL = '/api/qcms';

/** Fetch all QCMs, optionally filtered by topic and/or creator */
export const fetchQcms = async (topic?: Topic, createdBy?: string): Promise<Qcm[]> => {
  const params = new URLSearchParams();
  if (topic) params.set('topic', topic);
  if (createdBy) params.set('createdBy', createdBy);
  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch QCMs');
  return res.json() as Promise<Qcm[]>;
};

/** Fetch a single QCM by ID */
export const fetchQcmById = async (id: string): Promise<Qcm> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch QCM: ${id}`);
  return res.json() as Promise<Qcm>;
};

/** Create a new QCM */
export const createQcm = async (qcm: Omit<Qcm, 'id' | 'createdAt' | 'updatedAt'>): Promise<Qcm> => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(qcm),
  });
  if (!res.ok) throw new Error('Failed to create QCM');
  return res.json() as Promise<Qcm>;
};

/** Update an existing QCM */
export const updateQcm = async (id: string, updates: Partial<Qcm>): Promise<Qcm> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error(`Failed to update QCM: ${id}`);
  return res.json() as Promise<Qcm>;
};

/** Delete a QCM by ID */
export const deleteQcm = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete QCM: ${id}`);
};
