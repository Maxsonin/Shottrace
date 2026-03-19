import { Injectable, NotFoundException } from '@nestjs/common';
import { createMovieSlug } from 'src/common/utils/slugify.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { TmdbService } from 'src/tmdb/tmdb.service';
import { groupCrewByCategory } from './utils/group-crew';

@Injectable()
export class MoviesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
  ) {}

  async getMovieDetailsBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { canonicalSlug: slug },
    });

    if (!movie) throw new NotFoundException('Movie not found');

    const tmdbMovieData = await this.tmdbService.getMovieDetails(movie.tmdbId);

    const releaseYear = Number.parseInt(
      tmdbMovieData.release_date.split('-')[0],
    );

    const groupedCrew = groupCrewByCategory(tmdbMovieData.credits.crew);

    const director = groupedCrew.find((item) => item.category === 'Director')
      .names[0];

    return {
      ...tmdbMovieData,
      tmdb_id: tmdbMovieData.id,
      releaseYear,
      director,
      id: movie.id,
      cast: tmdbMovieData.credits.cast,
      crew: groupedCrew,
    };
  }

  async findOrCreateByTmdbId(tmdbId: number) {
    const movie = await this.prisma.movie.findUnique({ where: { tmdbId } });
    if (movie) return movie;

    const tmdbMovieData = await this.tmdbService.getMovieDetails(tmdbId);

    const title = tmdbMovieData.title;
    const year = Number.parseInt(tmdbMovieData.release_date.split('-')[0]);

    const canonicalSlug = createMovieSlug(title, year);

    return this.prisma.movie.create({
      data: {
        tmdbId,
        title,
        year,
        canonicalSlug,
      },
    });
  }
}
