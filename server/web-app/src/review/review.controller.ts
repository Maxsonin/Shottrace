import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dtos/review.dto';
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
  @Get(':movieId')
  findAll(@Param('movieId') movieId: number) {
    return this.reviewService.findAll(+movieId);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewService.remove(+id);
  }
}
