import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

import { TmdbMovie } from './types/tmdbMovie.type';
import { GetMovieDetailsOptions } from './types/getMovieDetailsOptions.type';

@Injectable()
export class TmdbClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('TMDB_BASE_URL');
    this.apiKey = this.configService.getOrThrow<string>('TMDB_API_KEY');
  }

  async getMovieDetails(
    tmdbId: number,
    options?: GetMovieDetailsOptions,
  ): Promise<TmdbMovie> {
    const url = `${this.baseUrl}/movie/${tmdbId}`;

    const config: AxiosRequestConfig = {
      params: {
        language: options?.language ?? 'en-US',
        append_to_response: options?.appendToResponse?.join(','),
      },
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'application/json',
      },
    };

    const { data } = await firstValueFrom(
      this.httpService.get<TmdbMovie>(url, config),
    );

    return data;
  }
}
