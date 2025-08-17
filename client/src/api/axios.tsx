import axios, { type AxiosRequestConfig } from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
  withCredentials: true,
});

export function makeRequest<T = any>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> {
  return api(url, options)
    .then((response) => {
      const data = response.data as T;
      console.log(`${url} response:`, data);
      return data;
    })
    .catch((error) =>
      Promise.reject(error?.response?.data?.message ?? 'Something went wrong')
    );
}
