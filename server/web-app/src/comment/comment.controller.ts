import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from 'src/common/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  create(@User('userId') userId: number, @Body() dto: CreateCommentDto) {
    return this.commentService.create(userId, dto);
  }

  @Put('comments/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto);
  }

  @Delete('comments/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.remove(id);
  }

  @Post('comments/:id/vote')
  voteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('value', ParseIntPipe) value: 1 | -1 | 0,
  ) {
    return this.commentService.voteComment(userId, commentId, value);
  }
}
