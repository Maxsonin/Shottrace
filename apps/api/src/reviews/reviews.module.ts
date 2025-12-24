import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { VotesService } from 'src/votes/vote.service';
import { CommentsService } from 'src/comments/comments.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, VotesService, CommentsService],
})
export class ReviewsModule {}
