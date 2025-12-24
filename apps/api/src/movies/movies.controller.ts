import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { toDto } from 'src/common/utils/to-dto.util';
import { MovieDto } from '@repo/api';
import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import { addMovieAndRedirectDocs, getMovieBySlugDocs } from './movies.docs';

@Controller()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiDoc(getMovieBySlugDocs)
  @Get('movie/:slug')
  async getMovieBySlug(@Param('slug') slug: string) {
    const movie = await this.moviesService.getMovieDetailsBySlug(slug);
    return toDto(MovieDto, movie);
  }

  @ApiDoc(addMovieAndRedirectDocs)
  @Get('tmdb/:tmdbId')
  @Redirect()
  async addMovieAndRedirect(@Param('tmdbId') tmdbId: number) {
    const movie = await this.moviesService.findOrCreateByTmdbId(tmdbId);
    return { url: `/movie/${movie.canonicalSlug}` };
  }
}
