import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

export class CommenterDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;
}

export class CommentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reviewId: number;

  @ApiProperty()
  content: string;

  @ApiProperty({
    description: 'Parent comment ID if this is a reply',
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({ type: CommenterDto })
  @ValidateNested({ each: true })
  @Type(() => CommenterDto)
  commenter: CommenterDto;

  @ApiProperty({ default: 0 })
  votes: number = 0;

  @ApiProperty({ default: 0 })
  userVote: number = 0;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
