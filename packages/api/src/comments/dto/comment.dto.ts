import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

class CommenterDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;
}

export class CommentDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  reviewId: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose()
  parentId: string | null;

  @ApiProperty({ type: CommenterDto })
  @Expose()
  @Type(() => CommenterDto)
  commenter: CommenterDto;

  @ApiProperty()
  @Expose()
  totalVotes: number;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  editedAt: Date;

  @ApiProperty()
  @Expose()
  hasMore: boolean;
}
