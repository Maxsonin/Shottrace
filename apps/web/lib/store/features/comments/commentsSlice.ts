import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { CommentDto as Comment } from '@repo/api';
import { RootState } from '../../store';

export const commentsAdapter = createEntityAdapter<Comment>();

const commentsSlice = createSlice({
  name: 'comments',
  initialState: commentsAdapter.getInitialState(),
  reducers: {
    upsertMany: commentsAdapter.upsertMany,
    createOne: commentsAdapter.addOne,
    updateOne: commentsAdapter.updateOne,
    removeOne: commentsAdapter.removeOne,
  },
});

export const commentsActions = commentsSlice.actions;
export default commentsSlice.reducer;

export const selectCommentsForReview = (reviewId: string) =>
  createSelector(
    (state: RootState) => state.comments,
    (comments) =>
      Object.values(comments.entities).filter(
        (c): c is Comment => !!c && c.reviewId === reviewId,
      ),
  );
