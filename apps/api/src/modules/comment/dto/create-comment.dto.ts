import { IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { WordCount } from "src/common/validators/WordCount";

export class CreateCommentDto {
	@IsString()
	@IsNotEmpty()
	@WordCount(1, 500, { message: "Comment must be between 1 and 500 words" })
	content: string;

	@IsInt()
	reviewId: number;

	@IsOptional()
	parentId?: number;
}
