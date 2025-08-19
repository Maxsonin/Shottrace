const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const getMovie = async (movieId: string) => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch movie: ${res.statusText}`);
  }

  return res.json();
};
