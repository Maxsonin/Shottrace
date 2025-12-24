import MovieDetails from '@/components/features/movies/MovieDetails';
import ReviewSection from '@/components/features/reviews/ReviewSection';

import { movieApi } from '@/lib/api/movie.api';
import { ApiError } from '@/lib/api/client';

import { notFound } from 'next/navigation';
import BackgroundImage from '@/components/features/page/BackgroundImage';

interface Props {
  params: { slug: string };
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params;

  try {
    const movie = await movieApi.getMovieDetails(slug);

    return (
      <>
        <BackgroundImage path={movie.backdropPath} />
        <div>
          <MovieDetails movie={movie} />
          <ReviewSection movieId={movie.id} />
        </div>
      </>
    );
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      notFound();
    }
    throw err;
  }
}
