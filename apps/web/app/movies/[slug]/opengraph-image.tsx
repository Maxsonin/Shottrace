import { movieApi } from '@/lib/api/movie.api';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const movie = await movieApi.getMovieDetails(slug);

  if (!movie) notFound();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          color: '#fff8f0',
          justifyContent: 'flex-end',
          backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdropPath})`,
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), rgba(0,0,0,0))',
          }}
        >
          <h1 style={{ fontSize: 72, margin: '0px 20px' }}>
            {movie.title} ({movie.releaseYear})
          </h1>
          <h2 style={{ fontSize: 36, margin: '0 20px 40px' }}>
            Directed by {movie.director}
          </h2>
        </div>
      </div>
    ),
  );
}
