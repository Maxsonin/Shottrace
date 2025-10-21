import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, ValidateNested } from "class-validator";
import { ReviewResponseDto } from "./reviews-response.dto";

export class PaginatedReviewsResponseDto {
	@ApiProperty({ type: [ReviewResponseDto] })
	@ValidateNested({ each: true })
	@Type(() => ReviewResponseDto)
	reviews: ReviewResponseDto[];

	@ApiProperty({ type: Number })
	@IsNumber()
	totalPages: number;
}
