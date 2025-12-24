import { Injectable } from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';
import { toDto } from 'src/common/utils/to-dto.util';
import { PrismaService } from 'src/prisma/prisma.service';
import { VotesService } from 'src/votes/vote.service';
import { ReviewDto } from '@repo/api';
import { CreateReviewDto } from '@repo/api/src/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '@repo/api';
import { PaginatedReviewsQueryDto } from '@repo/api';
import { Prisma } from 'prisma/client/generated/client';
import { PaginatedReviewsDto } from '@repo/api';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commentsService: CommentsService,
    private readonly votesService: VotesService,
  ) {}

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewDto> {
    const createdReview = await this.prisma.review.create({
      data: {
        reviewerId: userId,
        movieId: dto.movieId,
        content: dto.content,
        rating: dto.rating,
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

  async update(id: string, data: UpdateReviewDto) {
    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: { content: data.content, rating: data.rating },
      select: { content: true, rating: true, updatedAt: true },
    });

    return updatedReview;
  }

  async remove(id: string) {
    await this.prisma.review.delete({ where: { id } });
    return { id };
  }

  async getPaginatedReviews(
    userId: string | null,
    movieId: string,
    query: PaginatedReviewsQueryDto,
  ): Promise<{ reviews: ReviewDto[]; totalPages: number }> {
    const { limit = 5, page = 1, sortBy = 'createdAt', rating } = query;

    const whereCondition: Prisma.ReviewWhereInput = {
      movieId,
      ...(userId && { reviewerId: { not: userId } }),
      ...(rating && { rating }),
    };

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: [{ [sortBy]: 'desc' }, { createdAt: 'desc' }],
        include: {
          reviewer: { select: { id: true, username: true } },
        },
      }),
      this.prisma.review.count({ where: whereCondition }),
    ]);

    const [userReviewsVoteMap] = await Promise.all([
      this.votesService.getUserVotesForReviews(
        reviews.map((r) => r.id),
        userId,
      ),

      // this.commentsService.getCommentsForReviews(
      //   reviews.map((r) => r.id),
      //   userId,
      //   sortBy,
      // ),
    ]);

    const enrichedReviews = reviews.map((review) =>
      toDto(ReviewDto, {
        ...review,
        //comments: reviewCommentsMap.get(review.id),
        userVote: userReviewsVoteMap.get(review.id) ?? 0,
      }),
    );

    return toDto(PaginatedReviewsDto, {
      reviews: enrichedReviews,
      totalPages: Math.ceil(total / limit),
    });
  }

  async getMyReview(
    movieId: string,
    userId: string,
    query: PaginatedReviewsQueryDto,
  ): Promise<ReviewDto | null> {
    const { sortBy = 'createdAt' } = query;

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
      this.commentsService.getCommentsForReview(userReview.id, userId, sortBy),
      this.votesService.getUserReviewVote(userReview.id, userId),
    ]);

    return toDto(ReviewDto, {
      ...userReview,
      comments,
      userVote,
    });
  }
}
