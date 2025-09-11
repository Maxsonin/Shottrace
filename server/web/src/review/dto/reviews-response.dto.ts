import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { CommentResponseDto } from 'src/comment/dto/comment-response.dto';
import { IsValidRating } from 'src/common/validators/IsValidRating';

class ReviewerDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;
}

export class ReviewResponseDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsInt()
  movieId: number;

  @ApiProperty({ type: ReviewerDto })
  @ValidateNested()
  @Type(() => ReviewerDto)
  reviewer: ReviewerDto;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsValidRating()
  stars: number;

  @ApiProperty({ type: [CommentResponseDto], default: [] })
  @ValidateNested({ each: true })
  @Type(() => CommentResponseDto)
  comments: CommentResponseDto[] = [];

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
