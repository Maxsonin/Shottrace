import type { Review } from '../../types/movie.type';
import { makeRequest } from '../axios';

export const fetchMovieReviews = async (movieId: string, cursor?: number) => {
  const cursorParam = cursor ? `&cursor=${cursor}` : '';
  return makeRequest<{ reviews: Review[]; nextCursor: number | null }>(
    `/movies/${movieId}/reviews?limit=10${cursorParam}`
  );
};

export const fetchMyReview = async (movieId: string) => {
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
    method: 'PUT',
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
