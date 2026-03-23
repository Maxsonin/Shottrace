import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { IsValidRating } from '../../validators/is-valid-rating';
import { SortOptions } from 'reviews/types/sort';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedReviewsQueryDto {
  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 5,
    enum: [5, 10, 25],
  })
  @IsOptional()
  @IsInt()
  @IsIn([5, 10, 25] as const)
  limit?: number = 5;

  @ApiProperty({
    required: false,
    default: 'createdAt',
    enum: ['createdAt', 'totalVotes'],
  })
  @IsOptional()
  @IsIn(['createdAt', 'totalVotes'] as const)
  @IsString()
  sortBy?: SortOptions = 'createdAt';

  @ApiProperty({ required: false, enum: [1, 2, 3, 4, 5] })
  @IsOptional()
  @IsValidRating()
  rating?: number;
}
