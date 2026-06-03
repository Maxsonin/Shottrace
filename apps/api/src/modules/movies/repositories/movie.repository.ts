import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '../../../generated/prisma/internal/prismaNamespace';

import type { CreateMovieData } from '../types/createMovieData';

import { createMovieSlug } from '../helpers/create-slug';
import { randomBytes } from 'crypto';

@Injectable()
export class MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly MAX_SLUG_ATTEMPTS = 15;

  findBySlug(slug: string) {
    return this.prisma.movie.findUnique({
      where: { canonicalSlug: slug },
    });
  }

  findByTmdbId(tmdbId: number) {
    return this.prisma.movie.findUnique({
      where: { tmdbId },
    });
  }

  async create(data: CreateMovieData) {
    const baseSlug = createMovieSlug({ title: data.title, year: data.year });

    for (let attempt = 0; attempt <= this.MAX_SLUG_ATTEMPTS; attempt++) {
      const slug =
        attempt === 0
          ? baseSlug
          : `${baseSlug}-${randomBytes(3).toString('hex')}`;

      try {
        return await this.prisma.movie.create({
          data: { ...data, canonicalSlug: slug },
        });
      } catch (e) {
        if (
          !(e instanceof PrismaClientKnownRequestError) ||
          e.code !== 'P2002'
        ) {
          throw e;
        }
      }
    }

    throw new InternalServerErrorException(`Failed to create a movie`);
  }
}
