import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { CastDto, CrewDto } from './credits.dto';

export class MovieDto {
  @ApiProperty()
  @Expose()
  @IsString()
  id: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  tmdbId: number;

  @ApiProperty()
  @Expose()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  tagline?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  overview?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  posterPath?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  backdropPath?: string;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  runtime?: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ required: false })
  @Expose()
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ type: [CastDto], required: false })
  @Expose()
  @IsArray()
  @IsOptional()
  @Type(() => CastDto)
  @ValidateNested({ each: true })
  cast?: CastDto[];

  @ApiProperty({ type: [CrewDto], required: false })
  @Expose()
  @IsArray()
  @IsOptional()
  @Type(() => CrewDto)
  @ValidateNested({ each: true })
  crew?: CrewDto[];
}
