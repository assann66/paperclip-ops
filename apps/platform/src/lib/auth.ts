// Authentication stub for the AI Business Solutions Platform.
// Production: integrate Clerk or Auth.js.
// Currently returns a mock user for development.

import type { User } from './db';

const MOCK_USER: User = {
  id: 'user-1',
  email: 'demo@sad-solutions.com',
  name: 'Demo User',
  createdAt: new Date('2026-01-01'),
};

export function getCurrentUser(): User {
  return MOCK_USER;
}

export function isAuthenticated(): boolean {
  return true;
}
