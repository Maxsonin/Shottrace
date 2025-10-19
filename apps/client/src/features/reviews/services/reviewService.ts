import { makeRequest } from '@/shared/utils/axios';
import type { Review } from '../types/reviews.type';

export const getPaginatedReviews = async (
  movieId: string,
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  rating: number | null = null
) => {
  let query = `/movies/${movieId}/reviews?limit=${limit}&page=${page}&sortBy=${sortBy}`;
  if (rating) query += `&rating=${rating}`;

  return makeRequest<{ reviews: Review[]; totalPages: number }>(query);
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
