import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateReviewDto, ReviewDto, UpdateReviewDto } from '@repo/api';

export const myReviewApi = createApi({
  reducerPath: 'myReviewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
  }),
  tagTypes: ['MyReview'],
  endpoints: (builder) => ({
    getMyReview: builder.query<ReviewDto | null, string>({
      query: (movieId) => `movies/${movieId}/reviews/my`,
      providesTags: ['MyReview'],
    }),

    createMyReview: builder.mutation<ReviewDto, { data: CreateReviewDto }>({
      query: ({ data }) => ({
        url: `reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MyReview'],
    }),

    updateMyReview: builder.mutation<
      ReviewDto,
      { reviewId: string; data: UpdateReviewDto }
    >({
      query: ({ reviewId, data }) => ({
        url: `reviews/${reviewId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['MyReview'],
    }),

    deleteMyReview: builder.mutation<{ id: string }, string>({
      query: (reviewId) => ({
        url: `reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MyReview'],
    }),

    voteMyReview: builder.mutation<
      void,
      { reviewId: string; value: 1 | -1 | 0 }
    >({
      query: ({ reviewId, value }) => ({
        url: `reviews/${reviewId}/vote`,
        method: 'POST',
        body: { value },
      }),
      invalidatesTags: ['MyReview'],
    }),
  }),
});

export const {
  useGetMyReviewQuery,
  useCreateMyReviewMutation,
  useUpdateMyReviewMutation,
  useDeleteMyReviewMutation,
  useVoteMyReviewMutation,
} = myReviewApi;
