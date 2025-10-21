import { Module } from "@nestjs/common";
import { CommentModule } from "../comment/comment.module";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
	providers: [ReviewService],
	controllers: [ReviewController],
	imports: [CommentModule],
})
export class ReviewModule {}
