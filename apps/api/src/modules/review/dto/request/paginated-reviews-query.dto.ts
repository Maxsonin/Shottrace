import { IsIn, IsInt, IsOptional, Min } from "class-validator";
import { IsValidRating } from "src/common/validators/IsValidRating";
import { SortOptions } from "../../types/sort";

export class PaginatedReviewsQueryDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number = 1;

	@IsOptional()
	@IsInt()
	@IsIn([5, 10, 25] as const)
	limit?: number = 5;

	@IsOptional()
	@IsIn(["createdAt", "totalVotes"] as const)
	sortBy?: SortOptions = "createdAt";

	@IsOptional()
	@IsValidRating()
	rating?: number;
}
