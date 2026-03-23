import { IsOptional, IsUUID } from 'class-validator';
import { WordCount } from '../../validators/word-count';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @WordCount(1, 250, { message: 'Comment must be between 1 and 500 words' })
  content: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  reviewId: string;

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @IsUUID()
  @IsOptional()
  parentId?: string;
}
