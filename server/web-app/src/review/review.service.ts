import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dtos/review.dto';
import { UserEntity } from 'src/auth/types/auth.type';

interface FlatComment {
  id: number;
  content: string;
  rating: number;
  deleted: boolean;
  parentId: number | null;
  commenter: {
    username: string;
  };
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

  async findAll(movieId: number) {
    const reviews = await this.prisma.review.findMany({
      where: { movieId },
      include: {
        reviewer: { select: { username: true } },
      },
    });

    for (const review of reviews) {
      const flatComments: FlatComment[] = await this.prisma.comment.findMany({
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
        select: {
          id: true,
          content: true,
          rating: true,
          deleted: true,
          parentId: true,
          commenter: { select: { username: true } },
        },
      });

      review['comments'] = this.buildCommentTree(flatComments);
    }

    return reviews;
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

  remove(id: number) {
    return this.prisma.review.update({
      where: { id },
      data: { deleted: true },
    });
  }
}
