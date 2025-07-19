import api from './axios';

export const signIn = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await api.post('/auth/local/signin', { username, password });
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
  const response = await api.post('/auth/local/signup', {
    email,
    username,
    password,
  });
  return response.data;
};
