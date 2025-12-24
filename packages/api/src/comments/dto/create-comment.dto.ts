import { IsOptional, IsUUID } from 'class-validator';
import { WordCount } from '../../validators/word-count';

export class CreateCommentDto {
  @WordCount(1, 500, { message: 'Comment must be between 1 and 500 words' })
  content: string;

  @IsUUID()
  reviewId: string;

  @IsOptional()
  parentId?: string;
}
