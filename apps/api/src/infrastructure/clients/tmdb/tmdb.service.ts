import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';

import { TmdbClient } from './tmdb.client';
import { TmdbMovie } from './types/tmdbMovie.type';
import { GetMovieDetailsOptions } from './types/getMovieDetailsOptions.type';

@Injectable()
export class TmdbService {
  constructor(private readonly tmdbClient: TmdbClient) {}

  async getMovieDetails(
    tmdbId: number,
    options?: GetMovieDetailsOptions,
  ): Promise<TmdbMovie> {
    try {
      return await this.tmdbClient.getMovieDetails(tmdbId, options);
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status;

        if (status === 404) {
          throw new NotFoundException(`Failed to fetch movie`);
        }
      }

      throw new InternalServerErrorException('Failed to fetch movie');
    }
  }
}
