import type { Movie, MoviesStats } from '../types/movie.type';

type Props = Movie & MoviesStats;

export default function MovieDetails({
  title,
  poster_path,
  overview,
  likedCount,
  watchedCount,
}: Props) {
  return (
    <div>
      <h2>{title}</h2>
      <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} />
      <p>{overview}</p>
      <div>Liked: {likedCount}</div>
      <div>Watched: {watchedCount}</div>
    </div>
  );
}
