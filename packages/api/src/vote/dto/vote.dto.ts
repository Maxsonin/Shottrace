import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsInt } from 'class-validator';

// Request body — validated by the global ValidationPipe (untrusted input).
export class VoteDto {
  @ApiProperty({
    enum: [1, -1, 0],
    description: '1 = upvote, -1 = downvote, 0 = remove vote',
  })
  @IsInt()
  @IsIn([1, -1, 0])
  value: 1 | -1 | 0;
}

export class ReviewVoteResponseDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  reviewId: string;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  totalVotes: number;
}

export class CommentVoteResponseDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  commentId: string;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  totalVotes: number;
}
