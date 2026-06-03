import { Module } from '@nestjs/common';

import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from '../../infrastructure/clients/tmdb/tmdb.module';
import { MoviesRepository } from './repositories/movie.repository';

@Module({
  imports: [TmdbModule],
  controllers: [MoviesController],
  providers: [MoviesService, MoviesRepository],
})
export class MoviesModule {}
