import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ReviewDto } from './review.dto';

export class PaginatedReviewsDto {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @Expose()
  @IsNumber()
  totalPages: number;
}
