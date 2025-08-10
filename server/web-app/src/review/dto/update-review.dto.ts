import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { WordCount } from '../../common/validators/WordCount';
import { IsValidRating } from '../../common/validators/IsValidRating';

export class UpdateReviewDto {
  @IsString()
  @IsNotEmpty()
  @WordCount(1, 1000, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @Type(() => Number)
  @IsValidRating()
  stars: number;
}
