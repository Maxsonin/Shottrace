import { MovieDto as Movie } from '@repo/api';
import { apiFetch } from './client';

export const movieApi = {
  getMovieDetails: (id: string) => {
    return apiFetch<Movie>(`/movie/${id}`);
  },
};
