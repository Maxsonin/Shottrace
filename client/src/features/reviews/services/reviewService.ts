import { makeRequest } from '@/shared/utils/axios';
import type { Review } from '../types/reviews.type';

export const getReviews = async (movieId: string, cursor?: number) => {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return makeRequest<{ reviews: Review[]; nextCursor: number | null }>(
    `/movies/${movieId}/reviews?limit=10${cursorParam}`
  );
};

export const getUserReview = async (movieId: string) => {
  return makeRequest<Review>(`/movies/${movieId}/reviews/my`);
};

export const createReview = async (data: any) => {
  return makeRequest<Review>('/reviews', {
    method: 'POST',
    data,
  });
};

export const updateReview = async (reviewId: string | number, data: any) => {
  return makeRequest<Review>(`/reviews/${reviewId}`, {
    method: 'PATCH',
    data,
  });
};

export const deleteReview = async (reviewId: number) => {
  return makeRequest(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
};

export const voteReview = async (reviewId: number, data: any) => {
  return makeRequest(`/reviews/${reviewId}/vote`, {
    method: 'POST',
    data,
  });
};
