import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CastDto, CrewDto } from './credits.dto';
import { ValidateNested } from 'class-validator';

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

  @ApiProperty({ type: [CastDto], required: false })
  @Expose({ name: 'cast' })
  @ValidateNested({ each: true })
  @Type(() => CastDto)
  cast?: CastDto[];

  @ApiProperty({ type: [CrewDto], required: false })
  @Expose({ name: 'crew' })
  @ValidateNested({ each: true })
  @Type(() => CrewDto)
  crew?: CrewDto[];
}
