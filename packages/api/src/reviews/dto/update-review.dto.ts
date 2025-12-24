import { WordCount } from '../../validators/word-count';
import { IsValidRating } from '../../validators/is-valid-rating';

export class UpdateReviewDto {
  @WordCount(1, 1000, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @IsValidRating()
  rating: number;
}
