import { ApiProperty } from '@nestjs/swagger';
import { ReviewResponseDto } from './reviews-response.dto';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] })
  @ValidateNested({ each: true })
  @Type(() => ReviewResponseDto)
  reviews: ReviewResponseDto[];

  @ApiProperty({ type: Number })
  @IsNumber()
  totalPages: number;
}
