import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TmdbMovie } from './types/tmdb.type';

@Injectable()
export class TmdbService {
  private readonly tmdbBaseUrl: string;
  private readonly tmdbApiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.tmdbBaseUrl = this.configService.getOrThrow<string>('TMDB_BASE_URL');
    this.tmdbApiKey = this.configService.getOrThrow<string>('TMDB_API_KEY');
  }

  // TODO: can hang forever, add timeout (add httpService?)
  async getMovieDetails(tmdbId: number): Promise<TmdbMovie> {
    try {
      const url = `${this.tmdbBaseUrl}/movie/${tmdbId}?append_to_response=credits&language=en-US`;

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.tmdbApiKey}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        // TODO: incorrect error handling
        if (data.status_code === 34) {
          throw new NotFoundException(`Movie with TMDB ID ${tmdbId} not found`);
        }
        throw new InternalServerErrorException(
          `Something went wrong, please try again later`,
        );
      }

      return data as TmdbMovie;
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong, please try again later',
      );
    }
  }
}
