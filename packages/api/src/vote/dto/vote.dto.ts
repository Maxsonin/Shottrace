import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsIn, IsInt, IsString } from 'class-validator';

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
  @IsString()
  reviewId: string;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  @IsInt()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  @IsInt()
  totalVotes: number;
}

export class CommentVoteResponseDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsString()
  commentId: string;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  @IsInt()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  @IsInt()
  totalVotes: number;
}
