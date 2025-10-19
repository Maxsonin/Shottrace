import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getUserReview,
  createReview,
  updateReview,
  deleteReview,
} from '../services/reviewService';
import type { Review } from '../types/reviews.type';

export function useUserReview(movieId: string, userId?: number) {
  const queryClient = useQueryClient();

  const {
    data: userReview,
    isLoading: userReviewLoading,
    error: userReviewError,
  } = useQuery<Review | null>({
    queryKey: ['userReview', movieId, userId],
    queryFn: () => getUserReview(movieId),
    enabled: !!movieId && !!userId,
  });

  const addOrUpdateUserReview = async (data: {
    reviewId?: string | number;
    content: string;
    stars: number;
  }) => {
    let response: Review;

    if (data.reviewId) {
      response = await updateReview(data.reviewId, { ...data, votes: 0 });
    } else {
      response = await createReview({ ...data, movieId });
    }

    queryClient.setQueryData<Review>(
      ['userReview', movieId, userId],
      (oldReview) => {
        if (!oldReview) return response as Review;
        return {
          ...oldReview,
          ...response,
        };
      }
    );

    return response;
  };

  const deleteUserReviewHandler = async (reviewId: number) => {
    await deleteReview(reviewId);
    queryClient.setQueryData(['userReview', movieId, userId], null);
  };

  return {
    userReview,
    userReviewLoading,
    userReviewError,
    addOrUpdateUserReview,
    deleteUserReviewHandler,
  };
}
