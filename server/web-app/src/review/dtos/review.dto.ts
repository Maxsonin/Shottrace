import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { WordCount } from '../../common/validators/WordCount';
import { IsValidRating } from 'src/common/validators/IsValidRating';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  @WordCount(1, 1000, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @Type(() => Number)
  @IsValidRating()
  stars: number;

  @Type(() => Number)
  @IsInt()
  movieId: number;
}

export class UpdateReviewDto {
  @IsString()
  @IsNotEmpty()
  @WordCount(1, 1000, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @Type(() => Number)
  @IsValidRating()
  stars: number;

  @Type(() => Number)
  @IsInt()
  reviewId: number;
}
