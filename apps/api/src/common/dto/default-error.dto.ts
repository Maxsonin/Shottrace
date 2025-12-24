import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ enum: HttpStatus })
  statusCode: HttpStatus;

  @ApiProperty()
  error?: string;

  @ApiProperty()
  message?: string;

  @ApiProperty({ required: false })
  timestamp?: Date;

  @ApiProperty({ required: false })
  path?: string;

  @ApiProperty({ required: false, type: Object })
  details?: object;
}
