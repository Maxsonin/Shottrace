import type { MovieStats } from '../types/movie.type';

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const getMovie = async (movieId: string) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: 'application/json',
      },
    }
  );

  if (!res.ok) throw new Error(`Failed to fetch movie: ${res.statusText}`);

  const data = await res.json();
  console.log(data);
  return data;
};

export const getMovieStats = async (movieId: string): Promise<MovieStats> => {
  return {
    // Currently mock
    likedCount: Math.floor(Math.random() * 100),
    watchedCount: Math.floor(Math.random() * 100),
  };
};
