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

  findOne(id: number) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  async findAll(movieId: number, limit = 10, cursor?: number) {
    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      include: {
        reviewer: {
          select: { username: true },
        },
      },
    });

    for (const review of reviews) {
      await this.attachCommentsToReview(review);
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
      await this.attachCommentsToReview(userReview);
    }

    return userReview;
  }

  private async attachCommentsToReview(review: Review) {
    review['comments'] = await this.commentService.getCommentsTreeByReview(
      review.id,
    );
  }
}
