import { Injectable, NotFoundException } from '@nestjs/common';

import { MovieDto } from '@repo/api';

import { MoviesRepository } from './repositories/movie.repository';

import { toMovieDto } from './helpers/tmdb-movie.mapper';
import { extractYear } from './helpers/tmdb-field.mappers';
import { TmdbService } from '../../infrastructure/clients/tmdb/tmdb.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly moviesRepository: MoviesRepository,
    private readonly tmdbService: TmdbService,
  ) {}

  async getDetailsBySlug(slug: string): Promise<MovieDto> {
    const movie = await this.moviesRepository.findBySlug(slug);

    if (!movie) {
      throw new NotFoundException(`Movie ${slug} is not found.`);
    }

    const tmdbMovie = await this.tmdbService.getMovieDetails(movie.tmdbId, {
      appendToResponse: ['credits'],
    });

    return toMovieDto(movie, tmdbMovie);
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
