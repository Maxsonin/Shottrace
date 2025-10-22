import { IsValidRating } from "src/common/validators/IsValidRating";
import { WordCount } from "src/common/validators/WordCount";

export class UpdateReviewDto {
	@WordCount(1, 1000, { message: "Review must be between 1 and 1000 words" })
	content: string;

	@IsValidRating()
	stars: number;
}
