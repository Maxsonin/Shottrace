import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class CommenterDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username: string;
}

export class CommentDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  reviewId: string;

  @ApiProperty()
  @Expose()
  @IsString()
  content: string;

  @ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose()
  @IsOptional()
  @IsUUID()
  parentId: string | null;

  @ApiProperty({ type: CommenterDto })
  @Expose()
  @ValidateNested()
  @Type(() => CommenterDto)
  commenter: CommenterDto;

  @ApiProperty()
  @Expose()
  @IsInt()
  totalVotes: number;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  @IsInt()
  userVote: 1 | -1 | 0;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  @Type(() => Date)
  @IsDate()
  editedAt: Date;

  @ApiProperty()
  @Expose()
  @IsBoolean()
  hasMore: boolean;
}
