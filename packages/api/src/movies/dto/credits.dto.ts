import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CrewDto {
  @ApiProperty()
  @Expose()
  @IsString()
  category: string;

  @ApiProperty()
  @Expose()
  @IsArray()
  @Type(() => String)
  @IsString({ each: true })
  names: string[];
}

export class CastDto {
  @ApiProperty()
  @Expose()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  name: string;

  @ApiProperty()
  @Expose()
  @IsString()
  character: string;
}
