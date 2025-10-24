import { useQueryClient } from "@tanstack/react-query";
import { voteReview } from "../services/reviewService";
import type { Review } from "../types/reviews.type";

type ReviewsResponse = { reviews: Review[]; totalPages: number };

type Query = {
	limit?: number;
	page?: number;
	sortBy?: "createdAt" | "totalVotes";
	rating?: number | null;
};

const defaultQuery: Query = {
	limit: 5,
	page: 1,
	sortBy: "createdAt",
	rating: null,
};

export default function useVoteReview(
	movieId: string,
	userId?: number,
	query: Query = defaultQuery,
) {
	const { limit, page, sortBy, rating } = query;

	const queryClient = useQueryClient();

	const voteHandler = async (
		reviewId: number,
		value: 1 | -1 | 0,
		isUser: boolean,
	) => {
		if (!userId) return;

		await voteReview(reviewId, { userId, value });

		if (isUser) {
			queryClient.setQueryData<Review | null>(
				["userReview", movieId, userId],
				(old) =>
					old
						? {
								...old,
								totalVotes: (old.totalVotes ?? 0) - (old.userVote ?? 0) + value,
								userVote: value,
							}
						: old,
			);
		} else {
			queryClient.setQueryData<ReviewsResponse>(
				["reviews", movieId, userId, page, limit, sortBy, rating],
				(old) =>
					old
						? {
								...old,
								reviews: old.reviews.map((r) =>
									r.id === reviewId
										? {
												...r,
												totalVotes:
													(r.totalVotes ?? 0) - (r.userVote ?? 0) + value,
												userVote: value,
											}
										: r,
								),
							}
						: old,
			);
		}
	};

	return { voteHandler };
}
