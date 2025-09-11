import { IsNotEmpty, IsString } from 'class-validator';
import { WordCount } from '../../common/validators/WordCount';
import { IsValidRating } from '../../common/validators/IsValidRating';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @WordCount(1, 1000, { message: 'Review must be between 1 and 1000 words' })
  content: string;

  @ApiProperty()
  @IsValidRating()
  stars: number;
}
