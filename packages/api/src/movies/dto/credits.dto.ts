import { ApiProperty } from '@nestjs/swagger';

export class CrewDto {
  @ApiProperty()
  category: string;

  @ApiProperty({ type: [String] })
  names: string[];
}

export class CastDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  character: string;
}