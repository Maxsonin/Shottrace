import { useOutletContext, useParams } from 'react-router-dom';
import MovieDetails from '@/features/movies/components/MovieDetails';
import Reviews from '@/features/reviews/components/Reviews';
import type { OutletContextType } from '../layouts/MainLayout';

export default function MoviePage() {
  const { movieId } = useParams<{ movieId: string }>();
  const { setBackgroundImage } = useOutletContext<OutletContextType>();

  if (!movieId) return null;
  return (
    <>
      <MovieDetails movieId={movieId} setBackgroundImage={setBackgroundImage} />
      <Reviews movieId={movieId} />
    </>
  );
}
