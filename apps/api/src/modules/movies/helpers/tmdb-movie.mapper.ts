import { TmdbMovie } from '../../../infrastructure/clients/tmdb/types/tmdbMovie.type';
import { extractYear } from './extract-year';
import { groupCrewByCategory } from './group-crew';

export function mapTmdbToDomain(tmdbMovie: TmdbMovie) {
  const year = extractYear(tmdbMovie.release_date);

  const groupedCrew = tmdbMovie.credits?.crew
    ? groupCrewByCategory(tmdbMovie.credits.crew)
    : [];

  const director =
    groupedCrew.find((item) => item.category === 'Director')?.names?.[0] ??
    undefined;

  return {
    tmdbId: tmdbMovie.id,
    title: tmdbMovie.title,
    tagline: tmdbMovie.tagline,
    overview: tmdbMovie.overview,
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    runtime: tmdbMovie.runtime,
    year,
    director,
    cast: tmdbMovie.credits?.cast ?? [],
    crew: groupedCrew,
  };
}
