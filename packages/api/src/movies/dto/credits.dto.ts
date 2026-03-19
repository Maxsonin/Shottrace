import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CrewDto {
  @ApiProperty()
  @Expose()
  category: string;

  @ApiProperty()
  @Expose()
  names: string[];
}

export class CastDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  character: string;
}
