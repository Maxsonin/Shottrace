import { ApiProperty } from '@nestjs/swagger';
import { WordCount } from '../../validators/word-count';
import { Expose } from 'class-transformer';

export class UpdateCommentDto {
  @ApiProperty()
  @WordCount(1, 250, { message: 'Comment must be between 1 and 500 words' })
  content: string;
}

export class UpdateCommentResponseDto {
  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  editedAt: Date;
}
