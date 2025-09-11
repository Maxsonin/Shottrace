import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma, Review } from '@prisma/client';
import { CommentService } from '../comment/comment.service';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly commentService: CommentService,
  ) {}

  async create(userId: number, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
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

    return review;
  }

  async update(id: number, data: UpdateReviewDto) {
    return await this.prisma.review.update({
      where: { id },
      data: { content: data.content, stars: data.stars },
      select: { content: true, stars: true, updatedAt: true },
    });
  }

  async remove(id: number) {
    await this.prisma.review.delete({ where: { id } });
    return { id };
  }

  async getPaginatedReviews(
    userId: number | null,
    movieId: number,
    limit = 10,
    cursor?: number,
  ) {
    const cacheKey = userId ? null : `movie:${movieId}:reviews:${cursor ?? 0}`;

    if (cacheKey) {
      const cached = await this.redis.getJSON<typeof result>(cacheKey);
      if (cached) return cached;
    }

    const whereCondition: Prisma.ReviewWhereInput = { movieId };
    if (userId) {
      whereCondition.reviewerId = { not: userId };
    }

    // if userId is present, fetch extra to handle the exclusion
    const fetchSize = userId ? limit + 2 : limit + 1;

    let reviews = await this.prisma.review.findMany({
      where: whereCondition,
      take: fetchSize,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: {
        reviewer: { select: { id: true, username: true } },
      },
    });

    const hasNextPage = reviews.length > limit;
    const paginatedReviews = hasNextPage ? reviews.slice(0, limit) : reviews;
    const nextCursor = hasNextPage ? reviews[limit].id : null;

    for (const review of paginatedReviews) {
      await this.attachCommentsAndVotesToReview(review, userId ?? 0);
    }

    const result = { reviews: paginatedReviews, nextCursor };

    if (cacheKey && (!cursor || cursor < 3)) {
      await this.redis.setJSON(cacheKey, result, 60);
    }

    return result;
  }

  async getMyReview(movieId: number, userId: number) {
    const userReview = await this.prisma.review.findFirst({
      where: {
        reviewerId: userId,
        movieId,
      },
      include: {
        reviewer: { select: { id: true, username: true } },
      },
    });

    if (userReview) {
      await this.attachCommentsAndVotesToReview(userReview, userId);
    }

    return userReview;
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

  private async attachCommentsAndVotesToReview(review: Review, userId: number) {
    review['comments'] = await this.commentService.getCommentsByReview(
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
}
