import { MovieDto as Movie } from '@repo/api';
import Image from 'next/image';
import MovieHeader from './MovieHeader';
import MovieTabs from './MovieTabs';

interface Props {
  movie: Movie;
}

export default function MovieDetails({ movie }: Props) {
  return (
    <div className="flex gap-4 p-4">
      {movie.posterPath && (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
          alt={`Poster of ${movie.title}`}
          width={256}
          height={384}
          className="rounded-xl"
        />
      )}

      <section>
        <MovieHeader
          title={movie.title}
          releaseYear={movie.releaseYear}
          director={movie.director}
        />

        <h3 className="hidden">Synopsis</h3>
        {movie.tagline && <h4 className="italic">{movie.tagline}</h4>}
        {movie.overview && <p>{movie.overview}</p>}

        <MovieTabs />
      </section>
    </div>
  );
}
