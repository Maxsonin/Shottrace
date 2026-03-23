import { WordCount } from '../../validators/word-count';
import { IsValidRating } from '../../validators/is-valid-rating';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UpdateReviewDto {
  @ApiProperty()
  @WordCount(1, 450, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsValidRating()
  rating: number;
}

export class UpdateReviewResponseDto {
  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Expose()
  rating: number;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  editedAt: Date;
}
