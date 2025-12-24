import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class ReviewVoteDto {
  @ApiProperty()
  @IsString()
  reviewId: string;

  @ApiProperty()
  //@IsValidVote()
  userVote: number;

  @ApiProperty()
  @IsInt()
  totalVotes: number;
}

export class CommentVoteDto {
  @ApiProperty()
  @IsString()
  commentId: string;

  @ApiProperty()
  //@IsValidVote()
  userVote: number;

  @ApiProperty()
  @IsInt()
  totalVotes: number;
}
