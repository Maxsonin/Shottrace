import { Module } from "@nestjs/common";
import { CommentModule } from "../comment/comment.module";
import { VoteService } from "../vote/vote.service";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
	controllers: [ReviewController],
	providers: [ReviewService, VoteService],
	imports: [CommentModule],
})
export class ReviewModule {}
