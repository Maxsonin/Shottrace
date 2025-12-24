import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'prisma/client/generated/client';
import { VotesService } from 'src/votes/vote.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/common/guards/optionals-jwt-auth.guard';
import { CreateCommentDto, UpdateCommentDto } from '@repo/api';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly votesService: VotesService,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('reviews/:reviewId/comments')
  getComments(@CurrentUser() user: User, @Param('reviewId') reviewId: string) {
    return this.commentsService.getCommentsByReview(user?.id, reviewId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments')
  create(@CurrentUser() user: User, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('comments/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/vote')
  voteComment(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
    @Body('value', ParseIntPipe) value: 1 | -1 | 0,
  ) {
    return this.votesService.voteComment(user.id, commentId, value);
  }
}
