import { Expose, Type } from 'class-transformer';
import { ReviewDto } from './review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedReviewsDto {
  @ApiProperty({ type: [ReviewDto] })
  @Expose()
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @ApiProperty()
  @Expose()
  totalPages: number;
}
