import type { Review as ReviewType } from '../types/movie.type';
import ReviewElement from './ReviewElement';

type Props = {
  reviews: ReviewType[];
  currentUserId?: string | number;
  onChange?: (review: ReviewType) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewList({
  reviews,
  currentUserId,
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
          onChange={onChange}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}
