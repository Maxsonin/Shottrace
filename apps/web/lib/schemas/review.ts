import { z } from 'zod';
import { wordCount } from '../utils/zodWordCount';

const validRating = z.number().min(1, 'Please select a rating');

export const createReviewSchema = z.object({
  movieId: z.string(),
  content: wordCount(1, 450, 'Review'),
  rating: validRating,
});

export const updateReviewSchema = z.object({
  content: wordCount(1, 450, 'Review'),
  rating: validRating,
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
