import { Injectable } from "@nestjs/common";
import { Comment } from "@prisma/client";
import { toDto } from "src/common/utils/dto.utils";
import { PrismaService } from "../../core/prisma/prisma.service";
import { SortOptions } from "../review/types/sort";
import { VoteService } from "../vote/vote.service";
import { CreateCommentDto } from "./dto/request/create-comment.dto";
import { UpdateCommentDto } from "./dto/request/update-comment.dto";
import { CommentDto } from "./dto/response/comment.dto";

@Injectable()
export class CommentService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly voteService: VoteService,
	) {}

	async create(userId: number, dto: CreateCommentDto): Promise<CommentDto> {
		const newComment = await this.prisma.comment.create({
			data: {
				content: dto.content,
				commenterId: userId,
				reviewId: dto.reviewId,
				parentId: dto.parentId,
			},
			include: {
				commenter: { select: { id: true, username: true } },
			},
		});

		return toDto(CommentDto, {
			...newComment,
			userVote: 0,
		});
	}

	async update(id: number, dto: UpdateCommentDto) {
		const updatedComment = await this.prisma.comment.update({
			where: { id },
			data: { content: dto.content },
			select: { id: true, content: true, updatedAt: true },
		});

		return updatedComment;
	}

	async remove(id: number) {
		await this.prisma.comment.delete({ where: { id } });
		return { id };
	}

	// TODO: add pagination with "Load More" button
	async getCommentsForReviews(
		reviewIds: number[],
		userId: number | null,
		sortBy: SortOptions,
	): Promise<Map<number, CommentDto[]>> {
		const flatComments = await this.prisma.comment.findMany({
			where: { reviewId: { in: reviewIds } },
			orderBy: [{ [sortBy]: "desc" }, { createdAt: "desc" }],
			include: {
				commenter: {
					select: { id: true, username: true },
				},
			},
		});

		if (!flatComments.length) {
			return new Map<number, CommentDto[]>();
		}

		const enrichedComments = await this.enrichCommentsWithUserVotes(
			flatComments,
			userId,
		);

		const groupedComments = new Map<number, CommentDto[]>();
		for (const comment of enrichedComments) {
			if (!groupedComments.has(comment.reviewId)) {
				groupedComments.set(comment.reviewId, []);
			}
			groupedComments.get(comment.reviewId)!.push(comment);
		}

		return groupedComments;
	}

	async getCommentsForReview(
		reviewId: number,
		userId: number | null,
		sortBy: SortOptions,
	): Promise<CommentDto[]> {
		const map = await this.getCommentsForReviews([reviewId], userId, sortBy);
		return map.get(reviewId) ?? [];
	}

	private async enrichCommentsWithUserVotes(
		comments: Comment[],
		userId: number | null,
	): Promise<CommentDto[]> {
		const userVotesMap = userId
			? await this.voteService.getUserVotesForComments(
					comments.map((comment) => comment.id),
					userId,
				)
			: new Map<number, number>();

		return comments.map((comment) =>
			toDto(CommentDto, {
				...comment,
				userVote: userVotesMap.get(comment.id) ?? 0,
				hasMore: false, // TODO: implement pagination
			}),
		);
	}
}
