import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserEntity } from '../auth/types/auth.type';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from '@prisma/client';

interface CleanComment {
  id: number;
  content: string;
  rating: number;
  parentId: number | null;
  commenter: {
    username: string;
  };
}

interface NestedComment extends CleanComment {
  children: NestedComment[];
}

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

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
      data: reviews,
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

  findOne(id: number) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  // --- Comments logic ---
  private async attachCommentsToReview(review: Review) {
    const flatComments: CleanComment[] = await this.prisma.comment.findMany({
      where: {
        reviewId: review.id,
      },
      orderBy: {
        rating: 'desc',
      },
      select: {
        id: true,
        content: true,
        rating: true,
        parentId: true,
        commenter: {
          select: {
            username: true,
          },
        },
      },
    });

    // Attach comments
    review['comments'] = this.buildCommentTree(flatComments);
  }

  private buildCommentTree(comments: CleanComment[]): NestedComment[] {
    const commentMap = new Map<number, NestedComment>();
    const rootComments: NestedComment[] = [];

    for (const comment of comments) {
      commentMap.set(comment.id, { ...comment, children: [] });
    }

    // Link each comment to its parent or add to roots
    for (const comment of comments) {
      const currentComment = commentMap.get(comment.id)!;

      if (comment.parentId) {
        const parentComment = commentMap.get(comment.parentId);
        if (parentComment) {
          parentComment.children.push(currentComment);
        }
      } else {
        rootComments.push(currentComment);
      }
    }

    return rootComments;
  }
}
