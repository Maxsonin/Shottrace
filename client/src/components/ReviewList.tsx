import type { Review as ReviewType } from '../types/movie.type';
import ReviewElement from './ReviewElement';

type Props = {
  reviews: ReviewType[];
  currentUserId?: string | number;
  onVoteReview: (data: {
    reviewId: number;
    userId: number;
    value: 1 | -1 | 0;
  }) => void;
  onChange?: (review: ReviewType) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewList({
  reviews,
  currentUserId,
  onVoteReview,
  onChange,
  onDelete,
}: Props) {
  return (
    <>
      {reviews.map((review) => (
        <ReviewElement
          key={review.id}
          review={review}
          isUser={currentUserId === review.reviewer.id}
          onVoteReview={onVoteReview}
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
