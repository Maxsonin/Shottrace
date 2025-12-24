import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ReviewDto as Review } from '@repo/api';

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
