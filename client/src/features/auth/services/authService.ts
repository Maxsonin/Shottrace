import { makeRequest } from '@/shared/utils/axios';

export const signIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await makeRequest('/auth/local/signin', {
    method: 'POST',
    data: {
      username,
      password,
    },
  });
  return response.data;
};

export const signUp = async ({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) => {
  const response = await makeRequest('/auth/local/signup', {
    method: 'POST',
    data: {
      email,
      username,
      password,
    },
  });
  return response.data;
};

export const signOut = async () => {
  await makeRequest('/auth/logout', { method: 'POST' });
  return true;
};
