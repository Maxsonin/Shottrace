import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { Prisma, type Movie } from '../../../generated/prisma/client';

import type { CreateMovieData } from '../types/createMovieData';

import { createMovieSlug } from '../helpers/create-slug';

@Injectable()
export class MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findBySlug(slug: string): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: { canonicalSlug: slug },
    });
  }

  findByTmdbId(tmdbId: number): Promise<Movie | null> {
    return this.prisma.movie.findUnique({
      where: { tmdbId },
    });
  }

  async create(data: CreateMovieData): Promise<Movie> {
    const baseSlug = createMovieSlug({ title: data.title, year: data.year });
    const slugCandidates = [baseSlug, `${baseSlug}-${data.tmdbId}`];

    for (const canonicalSlug of slugCandidates) {
      try {
        return await this.prisma.movie.create({
          data: { ...data, canonicalSlug },
        });
      } catch (error: unknown) {
        const isSlugConflict =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002' &&
          String(error.meta?.target ?? '').includes('canonicalSlug');

        if (!isSlugConflict) {
          throw error;
        }
      }
    }

    throw new InternalServerErrorException('Failed to create a movie');
  }
}
