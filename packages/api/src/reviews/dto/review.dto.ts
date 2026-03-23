import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CommentDto } from '../../comments/dto/comment.dto';
import { IsValidRating } from '../../validators/is-valid-rating';
import { ApiProperty } from '@nestjs/swagger';

class ReviewerDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  username: string;
}

export class ReviewDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  id: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  @IsUUID()
  movieId: string;

  @ApiProperty({ type: ReviewerDto })
  @Expose()
  @ValidateNested()
  @Type(() => ReviewerDto)
  reviewer: ReviewerDto;

  @ApiProperty()
  @Expose()
  @IsString()
  content: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Expose()
  @IsValidRating()
  rating: number;

  // @Expose()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CommentDto)
  // comments: CommentDto[] = [];

  @ApiProperty()
  @Expose()
  @IsInt()
  totalVotes: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  totalComments: number;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  @IsInt()
  userVote: 1 | -1 | 0;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @IsDate()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @IsDate()
  editedAt: Date;
}
