import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbService } from 'src/tmdb/tmdb.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService, TmdbService],
})
export class MoviesModule {}
