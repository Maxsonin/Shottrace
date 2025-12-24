import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CommentDto as Comment,
  CreateCommentDto,
  UpdateCommentDto,
} from '@repo/api';
import { commentsActions } from './commentsSlice';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
  }),
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getComments: builder.query<Comment[], string>({
      query: (reviewId) => `reviews/${reviewId}/comments`,
      async onQueryStarted(reviewId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(commentsActions.upsertMany(data));
        } catch (error) {}
      },
    }),

    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (body) => ({
        url: `comments`,
        method: 'POST',
        body,
      }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(commentsActions.createOne(data));
        } catch (error) {}
      },
    }),

    updateComment: builder.mutation<
      Comment,
      { commentId: string } & UpdateCommentDto
    >({
      query: ({ commentId, ...body }) => ({
        url: `comments/${commentId}`,
        method: 'PATCH',
        body,
      }),
      async onQueryStarted(
        { commentId, ...body },
        { dispatch, queryFulfilled },
      ) {
        try {
          const { data } = await queryFulfilled;
          dispatch(commentsActions.updateOne({ id: commentId, changes: data }));
        } catch (error) {}
      },
    }),

    deleteComment: builder.mutation<
      { success: boolean; id: string },
      { commentId: string }
    >({
      query: ({ commentId }) => ({
        url: `comments/${commentId}`,
        method: 'DELETE',
      }),
      async onQueryStarted({ commentId }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(commentsActions.removeOne(data.id));
        } catch (error) {}
      },
    }),

    voteComment: builder.mutation<
      { totalVotes: number; userVote: 1 | -1 | 0 },
      { commentId: string; value: 1 | -1 | 0 }
    >({
      query: ({ commentId, value }) => ({
        url: `comments/${commentId}/vote`,
        method: 'POST',
        body: { value },
      }),
      async onQueryStarted({ commentId, value }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // data now includes userVote
          dispatch(commentsActions.updateOne({ id: commentId, changes: data }));
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useVoteCommentMutation,
} = commentsApi;
