import ReviewElement from './ReviewElement';
import type { Review } from '../types/reviews.type';
import ReviewComments from '@/features/comments/components/ReviewComments';

type Props = {
  review: Review;
  isUser: boolean;
  onVoteReview: (reviewId: number, value: 1 | -1 | 0, isUser: boolean) => void;
  onChange?: (review: Review) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewWithComments(props: Props) {
  const { review, isUser, onVoteReview, onChange, onDelete } = props;

  return (
    <div>
      <ReviewElement
        review={review}
        isUser={isUser}
        onVoteReview={onVoteReview}
        onChange={onChange}
        onDelete={onDelete}
      />
      <ReviewComments
        reviewId={review.id}
        initialComments={review.comments || []}
      />
    </div>
  );
}
