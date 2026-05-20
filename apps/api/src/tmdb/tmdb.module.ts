import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { TmdbService } from './tmdb.service';
import { TmdbClient } from './tmdb.client';

@Module({
  imports: [HttpModule],
  providers: [TmdbClient, TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
