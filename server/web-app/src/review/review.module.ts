import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { CommentModule } from '../comment/comment.module';

@Module({
  providers: [ReviewService],
  controllers: [ReviewController],
  imports: [CommentModule],
})
export class ReviewModule {}
