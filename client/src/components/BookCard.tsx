import { Link } from 'react-router-dom';
import type { Movie, MoviesStats } from '../types/movie.type';

type MovieCardProps = {
  movieStats: MoviesStats;
  movie: Movie;
};

const MovieCard = ({ movieStats, movie }: MovieCardProps) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="relative group w-50 rounded-lg overflow-hidden shadow-lg"
    >
      <img
        src={imageUrl}
        alt="Movie Poster"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {movieStats && (
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-sm">
          <div className="flex items-center space-x-2 mb-1">
            <span>❤️</span>
            <span>{movieStats.likedCount}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔥</span>
            <span>{movieStats.watchedCount}</span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default MovieCard;
