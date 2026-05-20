import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';

import { TmdbClient } from './tmdb.client';
import { TmdbMovie } from './types/tmdb.type';

@Injectable()
export class TmdbService {
  constructor(private readonly tmdbClient: TmdbClient) {}

  async getMovieDetails(tmdbId: number): Promise<TmdbMovie> {
    try {
      return await this.tmdbClient.getMovieDetails(tmdbId);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404) {
          throw new NotFoundException(`Movie with TMDB ID ${tmdbId} not found`);
        }
      }

      throw new InternalServerErrorException(
        'Failed to fetch movie details from TMDB',
      );
    }
  }
}
