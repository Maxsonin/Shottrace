import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { MoviesRepository } from './repositories/movie.repository';

import { mapTmdbToDomain } from './helpers/tmdb-movie.mapper';
import { extractYear } from './helpers/extract-year';
import { TmdbService } from '../../infrastructure/clients/tmdb/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly tmdbService: TmdbService,
  ) {}

  async getDetailsBySlug(slug: string) {
    const movie = await this.moviesRepository.findBySlug(slug);

    if (!movie) {
      throw new NotFoundException('Movie ' + slug + 'is not found.');
    }

    const tmdbMovie = await this.tmdbService.getMovieDetails(movie.tmdbId, {
      appendToResponse: ['credits'],
    });

    return mapTmdbToDomain(tmdbMovie);
  }

  async getOrCreateByTmdbId(tmdbId: number) {
    const existing = await this.moviesRepository.findByTmdbId(tmdbId);
    if (existing) return existing;

    const tmdbMovie = await this.tmdbService.getMovieDetails(tmdbId);

    return await this.moviesRepository.create({
      tmdbId,
      title: tmdbMovie.title,
      year: extractYear(tmdbMovie.release_date),
    });
  }
}
