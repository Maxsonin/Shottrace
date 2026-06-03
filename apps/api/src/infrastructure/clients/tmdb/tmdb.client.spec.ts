import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';

import { configServiceMock } from '../../../test/mocks/configService.mock';

import { TmdbClient } from './tmdb.client';

describe('TmdbClient', () => {
  let client: TmdbClient;

  const httpServiceMock = { get: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbClient,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    client = module.get<TmdbClient>(TmdbClient);
  });

  it('fetches movie from TMDB with correct config', async () => {
    httpServiceMock.get.mockReturnValue(of({ data: { id: 550 } }));

    const result = await client.getMovieDetails(550);

    expect(result).toEqual({ id: 550 });

    expect(httpServiceMock.get).toHaveBeenCalledTimes(1);

    expect(httpServiceMock.get).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/550',
      expect.objectContaining({
        params: {
          append_to_response: 'credits',
          language: 'en-US',
        },
        headers: expect.objectContaining({
          Authorization: 'Bearer test-api-key',
          Accept: 'application/json',
        }),
      }),
    );
  });
});
