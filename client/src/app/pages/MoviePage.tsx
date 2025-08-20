import { useParams } from 'react-router-dom';
import MovieDetails from '@/features/movies/components/MovieDetails';
import Reviews from '@/features/reviews/components/Reviews';
import { useAuth } from '../providers/AuthProvider';

export default function MoviePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const { loading } = useAuth();

  if (!movieId) return null;
  return (
    <>
      <MovieDetails movieId={movieId} />
      {loading ? <div>Loading...</div> : <Reviews movieId={movieId} />}
    </>
  );
}
