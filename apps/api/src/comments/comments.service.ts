import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VotesService } from 'src/votes/vote.service';
import { CommentDto, CreateCommentDto, UpdateCommentDto } from '@repo/api';
import { toDto } from 'src/common/utils/to-dto.util';
import { SortOptions } from '@repo/api';
import { Comment } from 'prisma/client/generated/client';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly votesService: VotesService,
  ) {}

  async getCommentsByReview(
    userId: string | null,
    reviewId: string,
  ): Promise<CommentDto[]> {
    const comments = await this.prisma.comment.findMany({
      where: { reviewId },
      include: {
        commenter: { select: { id: true, username: true } },
      },
    });

    if (userId) {
      return await this.enrichCommentsWithUserVotes(comments, userId);
    }

    return comments.map((comment) =>
      toDto(CommentDto, {
        ...comment,
        userVote: 0,
        hasMore: false,
      }),
    );
  }

  async create(userId: string, dto: CreateCommentDto): Promise<CommentDto> {
    const newComment = await this.prisma.comment.create({
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

    return toDto(CommentDto, {
      ...newComment,
      userVote: 0,
    });
  }

  async update(id: string, dto: UpdateCommentDto) {
    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { content: dto.content },
      select: { id: true, content: true, updatedAt: true },
    });

    return updatedComment;
  }

  async remove(id: string) {
    await this.prisma.comment.delete({ where: { id } });
    return { id };
  }

  // TODO: add pagination with "Load More" button
  async getCommentsForReviews(
    reviewIds: string[],
    userId: string | null,
    sortBy: SortOptions,
  ): Promise<Map<string, CommentDto[]>> {
    const flatComments = await this.prisma.comment.findMany({
      where: { reviewId: { in: reviewIds } },
      orderBy: [{ [sortBy]: 'desc' }, { createdAt: 'desc' }],
      include: {
        commenter: {
          select: { id: true, username: true },
        },
      },
    });

    if (!flatComments.length) {
      return new Map<string, CommentDto[]>();
    }

    const enrichedComments = await this.enrichCommentsWithUserVotes(
      flatComments,
      userId,
    );

    const groupedComments = new Map<string, CommentDto[]>();
    for (const comment of enrichedComments) {
      if (!groupedComments.has(comment.reviewId)) {
        groupedComments.set(comment.reviewId, []);
      }
      groupedComments.get(comment.reviewId)!.push(comment);
    }

    return groupedComments;
  }

  async getCommentsForReview(
    reviewId: string,
    userId: string | null,
    sortBy: SortOptions,
  ): Promise<CommentDto[]> {
    const map = await this.getCommentsForReviews([reviewId], userId, sortBy);
    return map.get(reviewId) ?? [];
  }

  private async enrichCommentsWithUserVotes(
    comments: Comment[],
    userId: string | null,
  ): Promise<CommentDto[]> {
    const userVotesMap = userId
      ? await this.votesService.getUserVotesForComments(
          comments.map((comment) => comment.id),
          userId,
        )
      : new Map<string, number>();

    return comments.map((comment) =>
      toDto(CommentDto, {
        ...comment,
        userVote: userVotesMap.get(comment.id) ?? 0,
        hasMore: false, // TODO: implement pagination
      }),
    );
  }
}
