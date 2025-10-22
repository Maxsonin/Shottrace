import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/prisma/prisma.service";

@Injectable()
export class VoteService {
	constructor(private readonly prisma: PrismaService) {}

	// TODO: add return type Promise<{ reviewId: number; userVote: number; totalVotes: number }>
	async voteReview(userId: number, reviewId: number, value: 1 | -1 | 0) {
		const existingVote = await this.prisma.vote.findUnique({
			where: { userId_reviewId: { userId, reviewId } },
		});

		// New vote
		if (!existingVote) {
			await this.prisma.$transaction([
				this.prisma.vote.create({ data: { userId, reviewId, value } }),
				this.prisma.review.update({
					where: { id: reviewId },
					data: { totalVotes: { increment: value } },
				}),
			]);
			return;
		}

		// User nor upvote nor downvote. Remove existing vote
		if (value === 0) {
			const change = this.calculateChangeInTotalVotes(
				existingVote.value,
				value,
			);

			await this.prisma.$transaction([
				this.prisma.vote.delete({ where: { id: existingVote.id } }),
				this.prisma.review.update({
					where: { id: reviewId },
					data: { totalVotes: { increment: change } },
				}),
			]);

			return;
		}

		// No change
		if (existingVote.value === value) return;

		// Change existing vote
		const change = this.calculateChangeInTotalVotes(existingVote.value, value);
		await this.prisma.$transaction([
			this.prisma.vote.update({
				where: { id: existingVote.id },
				data: { value },
			}),
			this.prisma.review.update({
				where: { id: reviewId },
				data: { totalVotes: { increment: change } },
			}),
		]);
	}

	async voteComment(userId: number, commentId: number, value: 1 | -1 | 0) {
		const existingVote = await this.prisma.vote.findUnique({
			where: { userId_commentId: { userId, commentId } },
		});

		if (!existingVote) {
			// New vote
			await this.prisma.$transaction([
				this.prisma.vote.create({ data: { userId, commentId, value } }),
				this.prisma.comment.update({
					where: { id: commentId },
					data: { totalVotes: { increment: value } },
				}),
			]);
			return;
		}

		if (value === 0) {
			// User nor upvote nor downvote. Remove existing vote
			const change = this.calculateChangeInTotalVotes(
				existingVote.value,
				value,
			);

			await this.prisma.$transaction([
				this.prisma.vote.delete({ where: { id: existingVote.id } }),
				this.prisma.comment.update({
					where: { id: commentId },
					data: { totalVotes: { increment: change } },
				}),
			]);

			return;
		}

		if (existingVote.value === value)
			// No change
			return;

		// Change existing vote
		const change = this.calculateChangeInTotalVotes(existingVote.value, value);
		await this.prisma.$transaction([
			this.prisma.vote.update({
				where: { id: existingVote.id },
				data: { value },
			}),
			this.prisma.comment.update({
				where: { id: commentId },
				data: { totalVotes: { increment: change } },
			}),
		]);
	}

	async getUserVotesForReviews(
		reviewIds: number[],
		userId: number | null,
	): Promise<Map<number, number>> {
		return userId
			? new Map(
					(
						await this.prisma.vote.findMany({
							where: { userId, reviewId: { in: reviewIds } },
							select: { reviewId: true, value: true },
						})
					).map((vote) => [vote.reviewId!, vote.value]),
				)
			: new Map<number, number>();
	}

	async getUserVotesForComments(
		commentIds: number[],
		userId: number,
	): Promise<Map<number, number>> {
		return new Map(
			(
				await this.prisma.vote.findMany({
					where: { userId, commentId: { in: commentIds } },
					select: { commentId: true, value: true },
				})
			).map((vote) => [vote.commentId!, vote.value]),
		);
	}

	async getUserReviewVote(reviewId: number, userId: number) {
		const vote = await this.prisma.vote.findUnique({
			where: { userId_reviewId: { userId, reviewId } },
			select: { value: true },
		});

		if (!vote) return 0;

		return vote.value;
	}

	private calculateChangeInTotalVotes(
		existing: number | null,
		newValue: number,
	) {
		if (existing === null) return newValue; // new vote
		if (newValue === 0) return existing === 1 ? -1 : 1; // remove vote
		return newValue - existing; // change existing vote, either +2 or -2
	}
}
