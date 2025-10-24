import { useQuery } from "@tanstack/react-query";
import { getPaginatedReviews } from "../services/reviewService";
import type { Review } from "../types/reviews.type";

type ReviewsResponse = { reviews: Review[]; totalPages: number };

export function useReviews(
	movieId: string,
	userId?: number,
	limit = 5,
	page: number = 1,
	sortBy = "createdAt",
	rating: number | null = null,
) {
	const { data, isLoading, error } = useQuery<ReviewsResponse>({
		queryKey: ["reviews", movieId, userId, page, limit, sortBy, rating],
		queryFn: () => getPaginatedReviews(movieId, page, limit, sortBy, rating),
		enabled: !!movieId,
	});

	return {
		reviews: data?.reviews ?? [],
		totalPages: data?.totalPages ?? 1,
		reviewsLoading: isLoading,
		reviewsError: error,
	};
}
