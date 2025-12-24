import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { PaginatedReviewsDto, PaginatedReviewsQueryDto } from '@repo/api';
import { reviewsActions } from './reviewsSlice';

export const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
  }),
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getPaginatedReviews: builder.query<
      { reviews: string[]; totalPages: number },
      { movieId: string } & PaginatedReviewsQueryDto
    >({
      async queryFn(
        { movieId, ...query },
        _queryApi,
        _extraOptions,
        fetchWithBQ,
      ) {
        const response = await fetchWithBQ(
          `movies/${movieId}/reviews?${new URLSearchParams(query as Record<string, string>)}`,
        );
        if (response.error) return { error: response.error };

        const data: PaginatedReviewsDto = response.data as PaginatedReviewsDto;
        _queryApi.dispatch(reviewsActions.upsertMany(data.reviews));

        return {
          data: {
            reviews: data.reviews.map((r) => r.id),
            totalPages: data.totalPages,
          },
        };
      },
    }),

    voteReview: builder.mutation<
      { totalVotes: number; userVote: 1 | -1 | 0 },
      { reviewId: string; value: 1 | -1 | 0 }
    >({
      query: ({ reviewId, value }) => ({
        url: `reviews/${reviewId}/vote`,
        method: 'POST',
        body: { value },
      }),
      async onQueryStarted({ reviewId, value }, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;
        dispatch(
          reviewsActions.updateOne({
            id: reviewId,
            changes: {
              userVote: value,
              totalVotes: data.totalVotes,
            },
          }),
        );
      },
    }),
  }),
});

export const { useGetPaginatedReviewsQuery, useVoteReviewMutation } =
  reviewsApi;
