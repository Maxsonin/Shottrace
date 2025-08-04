import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie, MoviesStats } from '../../types/movie.type';

type MovieWithStats = Movie & MoviesStats;

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Movie not found');
        return res.json();
      })
      .then((data) => {
        const movieWithStats: MovieWithStats = {
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          overview: data.overview,
          likedCount: Math.floor(Math.random() * 1000), // dummy data
          watchedCount: Math.floor(Math.random() * 1000), // dummy data
        };
        setMovie(movieWithStats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return null;

  return (
    <div>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <div>Liked: {movie.likedCount}</div>
      <div>Watched: {movie.watchedCount}</div>
    </div>
  );
}

export default MoviePage;
