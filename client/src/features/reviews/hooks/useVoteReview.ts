import { useQueryClient } from '@tanstack/react-query';
import { voteReview } from '../services/reviewService';
import type { Review } from '../types/reviews.type';

type ReviewsResponse = { reviews: Review[]; nextCursor: number | null };

export default function useVoteReview(movieId: string, userId?: number) {
  const queryClient = useQueryClient();

  const voteHandler = async (
    reviewId: number,
    value: 1 | -1 | 0,
    isUser: boolean
  ) => {
    if (!userId) return;

    await voteReview(reviewId, { userId, value });

    if (isUser) {
      queryClient.setQueryData<Review | null>(
        ['userReview', movieId, userId],
        (old) =>
          old
            ? {
                ...old,
                votes: (old.votes ?? 0) - (old.userVote ?? 0) + value,
                userVote: value,
              }
            : old
      );
    } else {
      queryClient.setQueryData<ReviewsResponse>(['reviews', movieId], (old) =>
        old
          ? {
              ...old,
              reviews: old.reviews.map((r) =>
                r.id === reviewId
                  ? {
                      ...r,
                      votes: (r.votes ?? 0) - (r.userVote ?? 0) + value,
                      userVote: value,
                    }
                  : r
              ),
            }
          : old
      );
    }
  };

  return { voteHandler };
}
