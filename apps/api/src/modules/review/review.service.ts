import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { toDto } from "src/common/utils/dto.utils";
import { PrismaService } from "../../core/prisma/prisma.service";
import { CommentService } from "../comment/comment.service";
import { VoteService } from "../vote/vote.service";
import { CreateReviewDto } from "./dto/request/create-review.dto";
import { PaginatedReviewsQueryDto } from "./dto/request/paginated-reviews-query.dto";
import { UpdateReviewDto } from "./dto/request/update-review.dto";
import { PaginatedReviewsDto } from "./dto/response/paginated-reviews.dto";
import { ReviewDto } from "./dto/response/review.dto";

@Injectable()
export class ReviewService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly commentService: CommentService,
		private readonly voteService: VoteService,
	) {}

	async create(userId: number, dto: CreateReviewDto): Promise<ReviewDto> {
		const createdReview = await this.prisma.review.create({
			data: {
				reviewerId: userId,
				movieId: dto.movieId,
				content: dto.content,
				stars: dto.stars,
			},
			include: {
				reviewer: { select: { id: true, username: true } },
			},
		});

		return toDto(ReviewDto, {
			...createdReview,
			comments: [],
			userVote: 0,
		});
	}

	async update(id: number, data: UpdateReviewDto) {
		const updatedReview = await this.prisma.review.update({
			where: { id },
			data: { content: data.content, stars: data.stars },
			select: { content: true, stars: true, updatedAt: true },
		});

		return updatedReview;
	}

	async remove(id: number) {
		await this.prisma.review.delete({ where: { id } });
		return { id };
	}

	async getPaginatedReviews(
		userId: number | null,
		movieId: number,
		query: PaginatedReviewsQueryDto,
	): Promise<{ reviews: ReviewDto[]; totalPages: number }> {
		const { limit = 5, page = 1, sortBy = "createdAt", rating } = query;

		const whereCondition: Prisma.ReviewWhereInput = {
			movieId,
			...(userId && { reviewerId: { not: userId } }),
			...(rating && { stars: rating }),
		};

		const skip = (page - 1) * limit;

		const [reviews, total] = await Promise.all([
			this.prisma.review.findMany({
				where: whereCondition,
				skip,
				take: limit,
				orderBy: [{ [sortBy]: "desc" }, { createdAt: "desc" }],
				include: {
					reviewer: { select: { id: true, username: true } },
				},
			}),
			this.prisma.review.count({ where: whereCondition }),
		]);

		const [userReviewsVoteMap, reviewCommentsMap] = await Promise.all([
			this.voteService.getUserVotesForReviews(
				reviews.map((r) => r.id),
				userId,
			),

			this.commentService.getCommentsForReviews(
				reviews.map((r) => r.id),
				userId,
				sortBy,
			),
		]);

		const enrichedReviews = reviews.map((review) =>
			toDto(ReviewDto, {
				...review,
				comments: reviewCommentsMap.get(review.id),
				userVote: userReviewsVoteMap.get(review.id) ?? 0,
			}),
		);

		return toDto(PaginatedReviewsDto, {
			reviews: enrichedReviews,
			totalPages: Math.ceil(total / limit),
		});
	}

	async getMyReview(
		movieId: number,
		userId: number,
		query: PaginatedReviewsQueryDto,
	): Promise<ReviewDto | null> {
		const { sortBy = "createdAt" } = query;

		const userReview = await this.prisma.review.findFirst({
			where: {
				reviewerId: userId,
				movieId,
			},
			include: {
				reviewer: { select: { id: true, username: true } },
			},
		});

		if (!userReview) {
			return null;
		}

		const [comments, userVote] = await Promise.all([
			this.commentService.getCommentsForReview(userReview.id, userId, sortBy),
			this.voteService.getUserReviewVote(userReview.id, userId),
		]);

		return toDto(ReviewDto, {
			...userReview,
			comments,
			userVote,
		});
	}
}
