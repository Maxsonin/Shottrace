import { Module } from "@nestjs/common";
import { VoteService } from "../vote/vote.service";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";

@Module({
	providers: [CommentService, VoteService],
	controllers: [CommentController],
	exports: [CommentService],
})
export class CommentModule {}
