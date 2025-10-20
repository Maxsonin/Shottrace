import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString } from "class-validator";
import { IsValidRating } from "../../common/validators/IsValidRating";
import { WordCount } from "../../common/validators/WordCount";

export class CreateReviewDto {
	@ApiProperty()
	@IsInt()
	movieId: number;

	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@WordCount(1, 1000, { message: "Review must be between 1 and 1000 words" })
	content: string;

	@ApiProperty()
	@IsValidRating()
	stars: number;
}
