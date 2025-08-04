import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dtos/comment.dto';
import { UserEntity } from 'src/auth/types/auth.type';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: UserEntity, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        commenterId: user.userId,
        reviewId: dto.reviewId,
        parentId: dto.parentId,
      },
    });
  }

  findByReview(reviewId: number) {
    return this.prisma.comment.findMany({
      where: { reviewId },
      include: { commenter: true, children: true },
    });
  }
}
