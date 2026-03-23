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
      <div className="w-64 h-96 shrink-0">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.posterPath}`}
          alt={`Poster for ${movie.title}`}
          width={256}
          height={384}
          className="rounded-xl"
        />
      </div>

      <section>
        <MovieHeader
          title={movie.title}
          releaseYear={movie.releaseYear}
          director={movie.director}
        />

        <h3 className="hidden">Synopsis</h3>
        {movie.tagline && <h4 className="italic">{movie.tagline}</h4>}
        {movie.overview && <p>{movie.overview}</p>}

        <MovieTabs movie={movie} />
      </section>
    </div>
  );
}
