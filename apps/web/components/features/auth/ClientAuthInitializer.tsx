'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { setUser } from '@/lib/store/features/auth/authSlice';
import { usersApi } from '@/lib/api/user.api';

export function ClientAuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    usersApi.getMe().then((user) => {
      if (user) {
        dispatch(setUser(user));
      }
    });
  }, [dispatch]);

  return null;
}
