import { Expose, Type } from "class-transformer";
import {
	IsBoolean,
	IsDate,
	IsInt,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

class CommenterDto {
	@Expose()
	@IsInt()
	id: number;

	@Expose()
	@IsString()
	username: string;
}

/*
 * We communicate with the client using flat comments
 * for easy manipulation with it in the client.
 * Client will render the tree.
 */
export class CommentDto {
	@Expose()
	@IsInt()
	id: number;

	@Expose()
	@IsInt()
	reviewId: number;

	@Expose()
	@IsString()
	content: string;

	@Expose()
	@IsOptional()
	parentId: number | null;

	@Expose()
	@ValidateNested()
	@Type(() => CommenterDto)
	commenter: CommenterDto;

	@Expose()
	@IsInt()
	totalVotes: number;

	@Expose()
	@IsInt()
	userVote: number;

	@Expose()
	@IsDate()
	createdAt: Date;

	@Expose()
	@IsDate()
	updatedAt: Date;

	@Expose()
	@IsBoolean()
	hasMore: boolean;
}
