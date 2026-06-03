import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ReviewerDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  username: string;
}

export class ReviewDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose()
  movieId: string;

  @ApiProperty({ type: ReviewerDto })
  @Expose()
  @Type(() => ReviewerDto)
  reviewer: ReviewerDto;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Expose()
  rating: number;

  @ApiProperty()
  @Expose()
  totalVotes: number;

  @ApiProperty()
  @Expose()
  totalComments: number;

  @ApiProperty({ enum: [1, -1, 0] })
  @Expose()
  userVote: 1 | -1 | 0;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  editedAt: Date;
}
