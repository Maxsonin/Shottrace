import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TmdbMovie } from './types/tmdb.type';

@Injectable()
export class TmdbService {
  private readonly baseUrl = 'https://api.themoviedb.org/3';
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow('TMDB_API_KEY');
  }

  async getMovieDetails(tmdbId: number): Promise<TmdbMovie> {
    try {
      const url = `${this.baseUrl}/movie/${tmdbId}?append_to_response=credits&language=en-US`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
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
