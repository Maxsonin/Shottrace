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
import { CreateCommentDto, UpdateCommentDto, VoteDto } from '@repo/api';
import { ApiDoc } from 'src/common/decorators/api-doc.decorator';
import {
  createCommentDocs,
  deleteCommentDocs,
  getCommentsDocs,
  updateCommentDocs,
  voteCommentDocs,
} from './comments.docs';

@Controller()
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly votesService: VotesService,
  ) {}

  @ApiDoc(getCommentsDocs)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('reviews/:reviewId/comments')
  getComments(@CurrentUser() user: User, @Param('reviewId') reviewId: string) {
    return this.commentsService.getCommentsByReview(user?.id, reviewId);
  }

  @ApiDoc(createCommentDocs)
  @UseGuards(JwtAuthGuard)
  @Post('comments')
  create(@CurrentUser() user: User, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(user.id, dto);
  }

  @ApiDoc(updateCommentDocs)
  @UseGuards(JwtAuthGuard)
  @Patch('comments/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @ApiDoc(deleteCommentDocs)
  @UseGuards(JwtAuthGuard)
  @Delete('comments/:id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @ApiDoc(voteCommentDocs)
  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/vote')
  voteComment(
    @CurrentUser() user: User,
    @Param('id') commentId: string,
    @Body() data: VoteDto,
  ) {
    return this.votesService.voteComment(user.id, commentId, data.value);
  }
}
