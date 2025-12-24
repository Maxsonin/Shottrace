import { configureStore } from '@reduxjs/toolkit';

import authReducer from './features/auth/authSlice';
import reviewsReducer from './features/reviews/reviewsSlice';
import commentsReducer from './features/comments/commentsSlice';

import { myReviewApi } from './features/reviews/myReviewApi';
import { reviewsApi } from './features/reviews/reviewsApi';
import { commentsApi } from './features/comments/commentsApi';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      reviews: reviewsReducer,
      comments: commentsReducer,

      // RTK Query reducers
      [myReviewApi.reducerPath]: myReviewApi.reducer,
      [reviewsApi.reducerPath]: reviewsApi.reducer,
      [commentsApi.reducerPath]: commentsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        myReviewApi.middleware,
        reviewsApi.middleware,
        commentsApi.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
