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
  UseInterceptors,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { UpdateReviewDto } from './dto/update-review.dto';
import { OptionalJwtAuthGuard } from 'src/common/guards/optional-jwt.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { ReviewResponseDto } from './dto/reviews-response.dto';
import { ResponseValidationInterceptor } from 'src/common/interceptors/response-validation.interceptor';
import { PaginatedReviewsResponseDto } from './dto/paginated-reviews-response.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Create a new review' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    type: ReviewResponseDto,
  })
  @Post('reviews')
  @UseInterceptors(new ResponseValidationInterceptor(ReviewResponseDto))
  create(@User('userId') userId: number, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(userId, dto);
  }

  @ApiOperation({ summary: 'Update a review' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Review updated successfully',
    schema: {
      example: {
        content: 'Updated review content',
        stars: 4,
        updatedAt: '2025-08-25T12:34:56.789Z',
      },
    },
  })
  @Put('reviews/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateReviewDto) {
    return this.reviewService.update(id, data);
  }

  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Review deleted successfully',
    schema: { example: { id: 42 } },
  })
  @Delete('reviews/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }

  @ApiOperation({ summary: 'Get paginated reviews for a movie' })
  @ApiResponse({
    status: 200,
    description: 'Reviews retrieved successfully',
    type: PaginatedReviewsResponseDto,
  })
  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get('movies/:movieId/reviews')
  @UseInterceptors(
    new ResponseValidationInterceptor(PaginatedReviewsResponseDto),
  )
  getPaginatedReviews(
    @User('userId') userId: number | null,
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('cursor') cursor?: number,
  ) {
    return this.reviewService.getPaginatedReviews(
      userId,
      movieId,
      limit,
      cursor,
    );
  }

  @ApiOperation({ summary: 'Get user reviews for a movie' })
  @ApiResponse({
    status: 200,
    description: 'User Review retrieved successfully',
    type: ReviewResponseDto,
  })
  @ApiBearerAuth()
  @Get('movies/:movieId/reviews/my')
  @UseInterceptors(new ResponseValidationInterceptor(ReviewResponseDto))
  getMyReview(
    @Param('movieId', ParseIntPipe) movieId: number,
    @User('userId') userId: number,
  ) {
    return this.reviewService.getMyReview(movieId, userId);
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
