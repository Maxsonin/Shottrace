import type { Metadata } from 'next';

import MovieDetails from '@/components/features/movies/MovieDetails';
import ReviewSection from '@/components/features/reviews/ReviewSection';
import BackgroundImage from '@/components/features/page/BackgroundImage';

import { movieApi } from '@/lib/api/movie.api';
import { ApiError } from '@/lib/api/client';

import { notFound } from 'next/navigation';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const movie = await movieApi.getMovieDetails(slug);
    if (!movie) notFound();

    return {
      title:
        movie.title +
        ` (` +
        movie.releaseYear +
        `) directed by ` +
        movie.director +
        ` | Shottrace`,
      description: movie.overview,

      // openGraph: {
      //   title: movie.title,
      //   description: movie.overview,
      //   images: [
      //     {
      //       url: `https://image.tmdb.org/t/p/original${movie.posterPath}`,
      //       width: 1200,
      //       height: 630,
      //     },
      //   ],
      // },

      twitter: {
        card: 'summary_large_image',
        title: movie.title,
        description: movie.overview,
        images: [`https://image.tmdb.org/t/p/original${movie.backdropPath}`],
      },
    };
  } catch {
    notFound();
  }
}

export default async function MoviePage({ params }: Props) {
  const { slug } = await params;

  try {
    const movie = await movieApi.getMovieDetails(slug);
    if (!movie) notFound();

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
