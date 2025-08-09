import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dtos/review.dto';
import { UserEntity } from 'src/auth/types/auth.type';
import { User } from 'src/common/decorators/user.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@User() user: UserEntity, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(user, dto);
  }

  @Public()
  @Get(':movieId/public')
  findAll(
    @Param('movieId') movieId: number,
    @Query('limit') limit = '10',
    @Query('cursor') cursor?: string,
  ) {
    return this.reviewService.findAll(
      +movieId,
      +limit,
      cursor ? +cursor : undefined,
    );
  }

  @Get(':movieId/user')
  findUserReview(@Param('movieId') movieId: number, @User() user: UserEntity) {
    return this.reviewService.findUserReview(+movieId, user);
  }

  @Put()
  update(@Body() data: UpdateReviewDto) {
    console.log(data);
    return this.reviewService.update(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
