import { IsInt, IsOptional } from "class-validator";
import { WordCount } from "src/common/validators/WordCount";

export class CreateCommentDto {
	@WordCount(1, 500, { message: "Comment must be between 1 and 500 words" })
	content: string;

	@IsInt()
	reviewId: number;

	@IsOptional()
	parentId?: number;
}
