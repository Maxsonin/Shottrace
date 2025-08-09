import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dtos/review.dto';
import { UserEntity } from 'src/auth/types/auth.type';

interface FlatComment {
  id: number;
  content: string;
  rating: number;
  parentId: number | null;
  commenter: {
    username: string;
  } | null;
}

interface NestedComment extends FlatComment {
  children: NestedComment[];
}

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  create(user: UserEntity, dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        content: dto.content,
        stars: dto.stars,
        movieId: dto.movieId,
        reviewerId: user.userId,
      },
    });
  }

  async findAll(movieId: number, limit = 10, cursor?: number) {
    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: [{ rating: 'desc' }, { id: 'desc' }],
      include: {
        reviewer: {
          select: { username: true },
        },
      },
    });

    for (const review of reviews) {
      await this.attachCommentsToReview(review);
    }

    const nextCursor =
      reviews.length === limit ? reviews[reviews.length - 1].id : null;

    return {
      data: reviews,
      nextCursor,
    };
  }

  async findUserReview(movieId: number, user: UserEntity) {
    const userReview = await this.prisma.review.findFirst({
      where: {
        reviewerId: user.userId,
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

  private async attachCommentsToReview(review: any): Promise<void> {
    const flatComments = await this.prisma.comment.findMany({
      where: {
        OR: [
          { reviewId: review.id },
          {
            parent: {
              reviewId: review.id,
            },
          },
        ],
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

    review['comments'] = this.buildCommentTree(flatComments);
  }

  private buildCommentTree(comments: FlatComment[]): NestedComment[] {
    const map = new Map<number, NestedComment>();
    const roots: NestedComment[] = [];

    for (const comment of comments) {
      map.set(comment.id, { ...comment, children: [] });
    }

    for (const comment of comments) {
      const node = map.get(comment.id)!;

      if (comment.parentId) {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  update(data: UpdateReviewDto) {
    return this.prisma.review.update({
      where: { id: data.reviewId },
      data: { content: data.content, stars: data.stars },
    });
  }

  remove(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
