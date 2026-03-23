import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ReviewDto } from './review.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedReviewsDto {
  @ApiProperty({ type: [ReviewDto] })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewDto)
  reviews: ReviewDto[];

  @ApiProperty()
  @Expose()
  @IsNumber()
  totalPages: number;
}
