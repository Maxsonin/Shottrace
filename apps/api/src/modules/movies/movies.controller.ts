import { Controller, Get, Param, Redirect } from '@nestjs/common';

import { MovieDto } from '@repo/api';

import { ApiDoc } from '../../shared/decorators/api-doc.decorator';
import { addMovieAndRedirectDocs, getMovieBySlugDocs } from './movies.docs';

import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiDoc(getMovieBySlugDocs)
  @Get('movie/:slug')
  async getMovieBySlug(@Param('slug') slug: string): Promise<MovieDto> {
    return this.moviesService.getDetailsBySlug(slug);
  }

  @ApiDoc(addMovieAndRedirectDocs)
  @Get('tmdb/:tmdbId')
  @Redirect()
  async importFromTmdb(@Param('tmdbId') tmdbId: number) {
    const movie = await this.moviesService.getOrCreateByTmdbId(tmdbId);
    return {
      url: `/movie/${movie.canonicalSlug}`,
    };
  }
}
