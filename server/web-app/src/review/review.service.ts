import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from '@prisma/client';
import { CommentService } from 'src/comment/comment.service';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  create(userId: number, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        reviewerId: userId,
        movieId: dto.movieId,
        content: dto.content,
        stars: dto.stars,
      },
    });
  }

  update(id: number, data: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id },
      data: { content: data.content, stars: data.stars },
    });
  }

  remove(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findAll(userId: number, movieId: number, limit = 10, cursor?: number) {
    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        reviewer: {
          select: { username: true },
        },
      },
    });

    for (const review of reviews) {
      await this.attachCommentsAndVotesToReview(review, userId);
    }

    // Check if there are more reviews
    const nextCursor =
      reviews.length === limit ? reviews[reviews.length - 1].id : null;

    return {
      reviews,
      nextCursor,
    };
  }

  async findMyReview(movieId: number, userId: number) {
    const userReview = await this.prisma.review.findFirst({
      where: {
        reviewerId: userId,
        movieId,
      },
      include: {
        reviewer: {
          select: { username: true },
        },
      },
    });

    if (userReview) {
      await this.attachCommentsAndVotesToReview(userReview, userId);
    }

    return userReview;
  }

  private async attachCommentsAndVotesToReview(review: Review, userId: number) {
    review['comments'] = await this.commentService.getCommentsTreeByReview(
      review.id,
      userId,
    );

    const votes = await this.prisma.vote.findMany({
      where: { reviewId: review.id },
    });
    const total = votes.reduce((sum, vote) => sum + vote.value, 0);
    const userVote = userId
      ? (votes.find((vote) => vote.userId === userId)?.value ?? 0)
      : 0;

    review['votes'] = total;
    review['userVote'] = userVote;
  }

  async voteReview(userId: number, reviewId: number, value: 1 | -1 | 0) {
    if (value === 0) {
      return this.prisma.vote.deleteMany({
        where: { userId, reviewId },
      });
    }

    return this.prisma.vote.upsert({
      where: { userId_reviewId: { userId, reviewId } },
      update: { value },
      create: { userId, reviewId, value },
    });
  }
}
