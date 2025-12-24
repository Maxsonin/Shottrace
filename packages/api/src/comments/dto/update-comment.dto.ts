import { WordCount } from '../../validators/word-count';

export class UpdateCommentDto {
  @WordCount(1, 500, { message: 'Comment must be between 1 and 500 words' })
  content: string;
}
