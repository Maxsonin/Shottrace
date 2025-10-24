import type { Comment } from "@/features/comments/types/comment.type";

export type Review = {
	id: number;
	createdAt: string;
	updatedAt: string;
	content: string;
	totalVotes: number;
	userVote: -1 | 1 | 0;
	stars: number;
	reviewer: {
		id: number;
		username: string;
	};
	comments: Comment[];
};

export type SortOptions = "createdAt" | "totalVotes";
export type ReviewsPerPageOptions = 5 | 10 | 25;

export type FilterOptions = {
	limit: number;
	sortBy: SortOptions;
	rating: number | null;
};
