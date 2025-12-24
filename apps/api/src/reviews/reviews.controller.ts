import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'prisma/client/generated/client';
import { VotesService } from 'src/votes/vote.service';
import { PaginatedReviewsQueryDto } from '@repo/api';
import { UpdateReviewDto } from '@repo/api';
import { CreateReviewDto } from '@repo/api';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/common/guards/optionals-jwt-auth.guard';

@Controller()
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly votesService: VotesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('reviews')
  create(@CurrentUser() user: User, @Body() dto: CreateReviewDto) {
    return this.reviewsService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('reviews/:id')
  update(@Param('id') id: string, @Body() data: UpdateReviewDto) {
    return this.reviewsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('movies/:movieId/reviews')
  getPaginatedReviews(
    @CurrentUser() user: User,
    @Param('movieId') movieId: string,
    @Query() query: PaginatedReviewsQueryDto,
  ) {
    return this.reviewsService.getPaginatedReviews(user.id, movieId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('movies/:movieId/reviews/my')
  getMyReview(
    @Param('movieId') movieId: string,
    @CurrentUser() user: User,
    @Query() query: PaginatedReviewsQueryDto,
  ) {
    return this.reviewsService.getMyReview(movieId, user.id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reviews/:id/vote')
  voteReview(
    @Param('id') reviewId: string,
    @CurrentUser() user: User,
    @Body('value', ParseIntPipe) value: 1 | -1 | 0,
  ) {
    return this.votesService.voteReview(user.id, reviewId, value);
  }
}
