import { useQuery } from '@tanstack/react-query';
import { getReviews } from '../services/reviewService';
import type { Review } from '../types/reviews.type';

type ReviewsResponse = { reviews: Review[]; nextCursor: number | null };

export function useReviews(movieId: string, userId?: number) {
  const { data, isLoading, error } = useQuery<ReviewsResponse>({
    queryKey: ['reviews', movieId, userId],
    queryFn: () => getReviews(movieId),
    enabled: !!movieId,
  });

  return {
    reviews: data?.reviews ?? [],
    nextCursor: data?.nextCursor ?? null,
    reviewsLoading: isLoading,
    reviewsError: error,
  };
}
