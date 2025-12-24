import { UserDto as User } from '@repo/api';
import { apiFetch } from './client';

export const usersApi = {
  getMe: () => {
    return apiFetch<User>(`/users/me`);
  },
};
