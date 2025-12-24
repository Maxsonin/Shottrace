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

class ReviewerDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsString()
  username: string;
}

export class ReviewDto {
  @Expose()
  @IsUUID()
  id: string;

  @Expose()
  @IsUUID()
  movieId: string;

  @Expose()
  @ValidateNested()
  @Type(() => ReviewerDto)
  reviewer: ReviewerDto;

  @Expose()
  @IsString()
  content: string;

  @Expose()
  @IsValidRating()
  rating: number;

  // @Expose()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => CommentDto)
  // comments: CommentDto[] = [];

  @Expose()
  @IsInt()
  totalVotes: number;

  @Expose()
  @IsInt()
  userVote: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
