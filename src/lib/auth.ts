// This file is no longer used with JWT authentication and can be considered for removal.
// The logic has been moved to the SessionProvider and related hooks.
import { cookies } from 'next/headers';
import { findUserById } from './data';
import type { User } from './types';

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = cookies();
  const userId = cookieStore.get('session-user-id')?.value;

  if (!userId) {
    return null;
  }

  try {
    const user = await findUserById(userId);
    return user || null;
  } catch (error) {
    console.error('Failed to fetch session user:', error);
    return null;
  }
}
