import { IsUUID } from 'class-validator';
import { WordCount } from '../../validators/word-count';
import { IsValidRating } from '../../validators/is-valid-rating';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  movieId: string;

  @ApiProperty()
  @WordCount(1, 450, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsValidRating()
  rating: number;
}
