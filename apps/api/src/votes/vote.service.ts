import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CommentVoteDto, ReviewVoteDto } from '@repo/api';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService) {}

  async voteReview(
    userId: string,
    reviewId: string,
    value: 1 | -1 | 0,
  ): Promise<ReviewVoteDto> {
    const existingVote = await this.prisma.vote.findUnique({
      where: { userId_reviewId: { userId, reviewId } },
    });

    // New vote
    if (!existingVote) {
      const [, updatedReview] = await this.prisma.$transaction([
        this.prisma.vote.create({ data: { userId, reviewId, value } }),
        this.prisma.review.update({
          where: { id: reviewId },
          data: { totalVotes: { increment: value } },
        }),
      ]);

      return {
        reviewId,
        userVote: value,
        totalVotes: updatedReview.totalVotes,
      };
    }

    // Remove existing vote
    if (value === 0) {
      const change = this.calculateChangeInTotalVotes(
        existingVote.value,
        value,
      );

      const [, updatedReview] = await this.prisma.$transaction([
        this.prisma.vote.delete({ where: { id: existingVote.id } }),
        this.prisma.review.update({
          where: { id: reviewId },
          data: { totalVotes: { increment: change } },
        }),
      ]);

      return { reviewId, userVote: 0, totalVotes: updatedReview.totalVotes };
    }

    // No change
    if (existingVote.value === value) {
      const review = await this.prisma.review.findUnique({
        where: { id: reviewId },
      });
      return { reviewId, userVote: value, totalVotes: review.totalVotes };
    }

    // Change existing vote
    const change = this.calculateChangeInTotalVotes(existingVote.value, value);
    const [, updatedReview] = await this.prisma.$transaction([
      this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
      }),
      this.prisma.review.update({
        where: { id: reviewId },
        data: { totalVotes: { increment: change } },
      }),
    ]);

    return { reviewId, userVote: value, totalVotes: updatedReview.totalVotes };
  }

  async voteComment(
    userId: string,
    commentId: string,
    value: 1 | -1 | 0,
  ): Promise<CommentVoteDto> {
    const existingVote = await this.prisma.vote.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });

    // New vote
    if (!existingVote) {
      const [, updatedComment] = await this.prisma.$transaction([
        this.prisma.vote.create({ data: { userId, commentId, value } }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { totalVotes: { increment: value } },
        }),
      ]);

      return {
        commentId,
        userVote: value,
        totalVotes: updatedComment.totalVotes,
      };
    }

    // Remove existing vote
    if (value === 0) {
      const change = this.calculateChangeInTotalVotes(
        existingVote.value,
        value,
      );

      const [, updatedComment] = await this.prisma.$transaction([
        this.prisma.vote.delete({ where: { id: existingVote.id } }),
        this.prisma.comment.update({
          where: { id: commentId },
          data: { totalVotes: { increment: change } },
        }),
      ]);

      return { commentId, userVote: 0, totalVotes: updatedComment.totalVotes };
    }

    // No change
    if (existingVote.value === value) {
      const comment = await this.prisma.comment.findUnique({
        where: { id: commentId },
      });
      return { commentId, userVote: value, totalVotes: comment.totalVotes };
    }

    // Change existing vote
    const change = this.calculateChangeInTotalVotes(existingVote.value, value);
    const [, updatedComment] = await this.prisma.$transaction([
      this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
      }),
      this.prisma.comment.update({
        where: { id: commentId },
        data: { totalVotes: { increment: change } },
      }),
    ]);

    return {
      commentId,
      userVote: value,
      totalVotes: updatedComment.totalVotes,
    };
  }

  async getUserVotesForReviews(
    reviewIds: string[],
    userId: string | null,
  ): Promise<Map<string, number>> {
    return userId
      ? new Map(
          (
            await this.prisma.vote.findMany({
              where: { userId, reviewId: { in: reviewIds } },
              select: { reviewId: true, value: true },
            })
          ).map((vote) => [vote.reviewId!, vote.value]),
        )
      : new Map<string, number>();
  }

  async getUserVotesForComments(
    commentIds: string[],
    userId: string,
  ): Promise<Map<string, number>> {
    return new Map(
      (
        await this.prisma.vote.findMany({
          where: { userId, commentId: { in: commentIds } },
          select: { commentId: true, value: true },
        })
      ).map((vote) => [vote.commentId!, vote.value]),
    );
  }

  async getUserReviewVote(reviewId: string, userId: string) {
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
