import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WordCount } from 'src/common/validators/WordCount';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @WordCount(1, 500, { message: 'Comment must be between 1 and 500 words' })
  content: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  reviewId: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;
}
