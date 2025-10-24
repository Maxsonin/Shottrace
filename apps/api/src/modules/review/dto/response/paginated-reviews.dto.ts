import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { ReviewDto } from "./review.dto";

export class PaginatedReviewsDto {
	@Expose()
	@ApiProperty({ type: [ReviewDto] })
	@ValidateNested({ each: true })
	@Type(() => ReviewDto)
	reviews: ReviewDto[];

	@Expose()
	@ApiProperty({ type: Number })
	@IsNumber()
	totalPages: number;
}
