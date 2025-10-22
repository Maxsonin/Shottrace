import { Expose, Type } from "class-transformer";
import { IsDate, IsInt, IsString, ValidateNested } from "class-validator";
import { IsValidRating } from "src/common/validators/IsValidRating";
import { CommentResponseDto } from "src/modules/comment/dto/comment-response.dto";

class ReviewerDto {
	@Expose()
	@IsInt()
	id: number;

	@Expose()
	@IsString()
	username: string;
}

export class ReviewDto {
	@Expose()
	@IsInt()
	id: number;

	@Expose()
	@IsInt()
	movieId: number;

	@Expose()
	@ValidateNested()
	@Type(() => ReviewerDto)
	reviewer: ReviewerDto;

	@Expose()
	@IsString()
	content: string;

	@Expose()
	@IsValidRating()
	stars: number;

	@ValidateNested({ each: true })
	@Type(() => CommentResponseDto)
	comments: CommentResponseDto[] = [];

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
