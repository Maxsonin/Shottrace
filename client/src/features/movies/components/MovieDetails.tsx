import { useQuery } from '@tanstack/react-query';
import type { MovieWithStats } from '../types/movie.type';
import { getMovie } from '../services/movieService';

type Props = {
  movieId: string;
  setBackgroundImage: (url: string) => void;
};

export default function MovieDetails({ movieId, setBackgroundImage }: Props) {
  const {
    data: movie,
    isPending: moviePending,
    error: movieError,
  } = useQuery<MovieWithStats>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie(movieId),
    staleTime: 1000 * 60 * 60,
  });

  setBackgroundImage(
    `https://image.tmdb.org/t/p/w1280/${movie?.backdrop_path}`
  );

  if (movieError) console.error(movieError);

  if (moviePending) return <div>Loading...</div>;
  if (!movie) return null;
  return (
    <div>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p>Budget: {movie.budget}</p>
      <div>Liked: {movie.likedCount}</div>
      <div>Watched: {movie.watchedCount}</div>
    </div>
  );
}
