import { cache } from 'react';
import { MovieDto as Movie } from '@repo/api';
import { apiFetch } from './client';

export const movieApi = {
  getMovieDetails: cache((id: string) => {
    return apiFetch<Movie>(`/movie/${id}`, { next: { revalidate: 86400 } }); // 1 day
  }),
};
