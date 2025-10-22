import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { User } from "src/common/decorators/user.decorator";
import { OptionalJwtAuthGuard } from "src/common/guards/optional-jwt.guard";
import { VoteService } from "../vote/vote.service";
import { CreateReviewDto } from "./dto/request/create-review.dto";
import { PaginatedReviewsQueryDto } from "./dto/request/paginated-reviews-query.dto";
import { UpdateReviewDto } from "./dto/request/update-review.dto";
import { ReviewService } from "./review.service";

@Controller()
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly voteService: VoteService,
	) {}

	@Post("reviews")
	create(@User("userId") userId: number, @Body() dto: CreateReviewDto) {
		return this.reviewService.create(userId, dto);
	}

	@Patch("reviews/:id")
	update(@Param("id", ParseIntPipe) id: number, @Body() data: UpdateReviewDto) {
		return this.reviewService.update(id, data);
	}

	@Delete("reviews/:id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.reviewService.remove(id);
	}

	@Public()
	@UseGuards(OptionalJwtAuthGuard)
	@Get("movies/:movieId/reviews")
	getPaginatedReviews(
		@User("userId") userId: number | null,
		@Param("movieId", ParseIntPipe) movieId: number,
		@Query() query: PaginatedReviewsQueryDto,
	) {
		return this.reviewService.getPaginatedReviews(userId, movieId, query);
	}

	@Get("movies/:movieId/reviews/my")
	getMyReview(
		@Param("movieId", ParseIntPipe) movieId: number,
		@User("userId") userId: number,
		@Query() query: PaginatedReviewsQueryDto,
	) {
		return this.reviewService.getMyReview(movieId, userId, query);
	}

	@Post("reviews/:id/vote")
	voteReview(
		@Param("id", ParseIntPipe) reviewId: number,
		@Body("userId", ParseIntPipe) userId: number,
		@Body("value", ParseIntPipe) value: 1 | -1 | 0,
	) {
		return this.voteService.voteReview(userId, reviewId, value);
	}
}
