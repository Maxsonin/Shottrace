import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from '@prisma/client';

export type CleanComment = {
  id: number;
  createdAt: Date;
  reviewId: number;
  content: string;
  parentId: number | null;
  commenter: {
    id: number;
    username: string;
  };
};

export type NestedComment = CleanComment & { children: NestedComment[] };

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        content: dto.content,
        commenterId: userId,
        reviewId: dto.reviewId,
        parentId: dto.parentId,
      },
      include: {
        commenter: { select: { id: true, username: true } },
      },
    });

    const withVotes = await this.attachVotesToComment(comment, userId);

    return {
      ...withVotes,
      children: [],
    };
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

  async getCommentsTreeByReview(
    reviewId: number,
    userId?: number, // optional to get current user's vote
  ): Promise<NestedComment[]> {
    const flatComments: CleanComment[] = await this.prisma.comment.findMany({
      where: { reviewId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        createdAt: true,
        content: true,
        reviewId: true,
        parentId: true,
        commenter: {
          select: { id: true, username: true },
        },
      },
    });

    const commentIds = flatComments.map((c) => c.id);
    const votes = await this.prisma.vote.findMany({
      where: { commentId: { in: commentIds } },
    });

    const votesMap = commentIds.reduce<
      Record<number, { votes: number; userVote: number }>
    >((acc, id) => {
      const commentVotes = votes.filter((v) => v.commentId === id);
      const total = commentVotes.reduce((sum, v) => sum + v.value, 0);
      const userVote = userId
        ? (commentVotes.find((v) => v.userId === userId)?.value ?? 0)
        : 0;
      acc[id] = { votes: total, userVote };
      return acc;
    }, {});

    const flatCommentsWithVotes = flatComments.map((c) => ({
      ...c,
      votes: votesMap[c.id].votes,
      userVote: votesMap[c.id].userVote,
    }));

    flatCommentsWithVotes.sort((a, b) => b.votes - a.votes);

    return this.buildCommentTree(flatCommentsWithVotes);
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

  async voteComment(userId: number, commentId: number, value: 1 | -1 | 0) {
    if (value === 0) {
      return this.prisma.vote.deleteMany({
        where: { userId, commentId },
      });
    }

    return this.prisma.vote.upsert({
      where: { userId_commentId: { userId, commentId } },
      update: { value },
      create: { userId, commentId, value },
    });
  }

  private async attachVotesToComment(comment: Comment, userId: number) {
    const votes = await this.prisma.vote.findMany({
      where: { commentId: comment.id },
    });

    const total = votes.reduce((sum, v) => sum + v.value, 0);
    const userVote = userId
      ? (votes.find((v) => v.userId === userId)?.value ?? 0)
      : 0;

    (comment as any).votes = total;
    (comment as any).userVote = userVote;

    return comment;
  }
}
