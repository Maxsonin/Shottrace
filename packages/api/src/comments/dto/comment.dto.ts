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
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  username: string;
}

export class CommentDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsUUID()
  reviewId: string;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsOptional()
  @IsUUID()
  parentId: string | null;

  @Expose()
  @ValidateNested()
  @Type(() => CommenterDto)
  commenter: CommenterDto;

  @Expose()
  @IsInt()
  totalVotes: number;

  @Expose()
  @IsInt()
  userVote: number;

  @Expose()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsBoolean()
  hasMore: boolean;
}
