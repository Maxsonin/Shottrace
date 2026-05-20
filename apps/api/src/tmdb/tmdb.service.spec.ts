import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { TmdbService } from './tmdb.service';
import { TmdbClient } from './tmdb.client';

describe('TmdbService', () => {
  let service: TmdbService;

  const clientMock = {
    getMovieDetails: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbService,
        {
          provide: TmdbClient,
          useValue: clientMock,
        },
      ],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
  });

  it('returns movie details when client succeeds', async () => {
    clientMock.getMovieDetails.mockResolvedValue({ id: 550 });

    await expect(service.getMovieDetails(550)).resolves.toEqual({ id: 550 });
  });

  it('maps 404 to NotFoundException', async () => {
    clientMock.getMovieDetails.mockRejectedValue({
      isAxiosError: true,
      response: { status: 404 },
    });

    await expect(service.getMovieDetails(550)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('maps unknown errors to InternalServerErrorException', async () => {
    clientMock.getMovieDetails.mockRejectedValue(new Error('Unknown error'));

    await expect(service.getMovieDetails(550)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
