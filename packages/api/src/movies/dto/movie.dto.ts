import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose({ name: 'tmdb_id' })
  tmdbId: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  tagline?: string;

  @ApiProperty({ required: false })
  @Expose()
  overview?: string;

  @ApiProperty({ required: false })
  @Expose({ name: 'poster_path' })
  posterPath?: string;

  @ApiProperty({ required: false })
  @Expose({ name: 'backdrop_path' })
  backdropPath?: string;

  @ApiProperty({ required: false })
  @Expose()
  runtime?: number;

  @ApiProperty({ required: false })
  @Expose()
  releaseYear?: number;

  @ApiProperty({ required: false })
  @Expose()
  director?: string;
}
