import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

export type CleanComment = {
  id: number;
  content: string;
  rating: number;
  parentId: number | null;
  commenter: {
    username: string;
  };
};

export type NestedComment = CleanComment & { children: NestedComment[] };

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        commenterId: userId,
        reviewId: dto.reviewId,
        parentId: dto.parentId,
      },
    });
  }

  update(id: number, dto: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
    });
  }

  remove(id: number) {
    return this.prisma.comment.delete({ where: { id } });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({ where: { id } });
  }

  async getCommentsTreeByReview(reviewId: number): Promise<NestedComment[]> {
    const flatComments: CleanComment[] = await this.prisma.comment.findMany({
      where: { reviewId },
      orderBy: { rating: 'desc' },
      select: {
        id: true,
        createdAt: true,
        content: true,
        rating: true,
        reviewId: true,
        parentId: true,
        commenter: {
          select: { id: true, username: true },
        },
      },
    });

    return this.buildCommentTree(flatComments);
  }

  private buildCommentTree(comments: CleanComment[]): NestedComment[] {
    const commentMap = new Map<number, NestedComment>();
    const rootComments: NestedComment[] = [];

    for (const comment of comments) {
      commentMap.set(comment.id, { ...comment, children: [] });
    }

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
