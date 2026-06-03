import { ApiProperty } from '@nestjs/swagger';

import { CastDto, CrewDto } from './credits.dto';

export class MovieDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tmdbId: number;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  tagline?: string;

  @ApiProperty({ required: false })
  overview?: string;

  @ApiProperty({ required: false })
  posterPath?: string;

  @ApiProperty({ required: false })
  backdropPath?: string;

  @ApiProperty({ required: false })
  runtime?: number;

  @ApiProperty({ required: false })
  year?: number;

  @ApiProperty({ type: [String], required: false })
  director?: string[];

  @ApiProperty({ type: [CastDto], required: false })
  cast?: CastDto[];

  @ApiProperty({ type: [CrewDto], required: false })
  crew?: CrewDto[];
}