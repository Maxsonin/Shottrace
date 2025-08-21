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
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserEntity } from 'src/auth/types/auth.type';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt.guard';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('reviews')
  create(@User('userId') userId: number, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(userId, dto);
  }

  @Put('reviews/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateReviewDto) {
    return this.reviewService.update(id, data);
  }

  @Delete('reviews/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.reviewService.remove(id);
    return;
  }

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('movies/:movieId/reviews')
  findAll(
    @User('userId') userId: number,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('cursor') cursor?: number,
  ) {
    return this.reviewService.findAll(userId, movieId, limit, cursor);
  }

  @Get('movies/:movieId/reviews/my')
  findMyReview(
    @Param('movieId', ParseIntPipe) movieId: number,
    @User('userId') userId: number,
  ) {
    return this.reviewService.findMyReview(movieId, userId);
  }

  @Post('reviews/:id/vote')
  voteReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('value', ParseIntPipe) value: 1 | -1 | 0,
  ) {
    return this.reviewService.voteReview(userId, reviewId, value);
  }
}
