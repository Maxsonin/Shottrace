import axios, { type AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
  withCredentials: true,
});

export function makeRequest<T = any>(
  url: string,
  options?: AxiosRequestConfig
) {
  return api(url, options)
    .then((response) => response.data as T)
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? 'Something went wrong')
    );
}
