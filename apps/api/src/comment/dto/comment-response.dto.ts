import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

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
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  reviewId: number;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Parent comment ID if this is a reply',
    nullable: true,
  })
  @IsOptional()
  parentId: number | null;

  @ApiProperty({ type: CommenterDto })
  @ValidateNested()
  @Type(() => CommenterDto)
  commenter: CommenterDto;

  @ApiProperty({ default: 0 })
  @IsInt()
  votes: number = 0;

  @ApiProperty({ default: 0 })
  @IsInt()
  userVote: number = 0;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
