import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ReviewDto as Review } from '@repo/api';
import { RootState } from '../../store';

export const reviewsAdapter = createEntityAdapter<Review>();

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: reviewsAdapter.getInitialState(),
  reducers: {
    upsertMany: reviewsAdapter.upsertMany,
    updateOne: reviewsAdapter.updateOne,
  },
});

export const reviewsActions = reviewsSlice.actions;
export default reviewsSlice.reducer;

export const { selectAll: selectAllReviews } =
  reviewsAdapter.getSelectors<RootState>((state) => state.reviews);
