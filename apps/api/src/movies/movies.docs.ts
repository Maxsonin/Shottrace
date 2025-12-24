import { HttpStatus } from '@nestjs/common';
import { MovieDto } from '@repo/api';
import { ApiDocConfig } from 'src/common/decorators/api-doc.decorator';

export const getMovieBySlugDocs: ApiDocConfig<null, MovieDto> = {
  summary: 'Fetch movie details by slug',
  description: 'Returns TMDB-enriched movie details for the given slug.',
  responses: [
    {
      status: HttpStatus.OK,
      type: MovieDto,
      description: 'Movie was successfully fetched.',
    },
    {
      status: HttpStatus.NOT_FOUND,
      errorExample: { message: 'Movie not found' },
    },
  ],
};

export const addMovieAndRedirectDocs: ApiDocConfig<null, null> = {
  summary: 'Find or create a movie by TMDB ID and redirect to it',
  description:
    'Creates a movie entry if missing and if exists, then redirects to the canonical slug.',
  responses: [
    {
      status: HttpStatus.FOUND,
      description: 'Redirection to the created or existing movie resource.',
    },
    {
      status: HttpStatus.NOT_FOUND,
      errorExample: { message: 'Movie with TMDB ID ${tmdbId} not found' },
    },
    {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorExample: { message: 'Something went wrong, please try again later' },
    },
  ],
};
