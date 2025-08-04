import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserEntity } from 'src/auth/types/auth.type';
import { User } from 'src/common/decorators/user.decorator';
import { CreateCommentDto } from './dtos/comment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@User() user: UserEntity, @Body() dto: CreateCommentDto) {
    return this.commentService.create(user, dto);
  }

  @Public()
  @Get()
  findByReview(reviewId: number) {
    return this.commentService.findByReview(reviewId);
  }
}
