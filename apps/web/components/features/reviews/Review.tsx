'use client';

import { ReviewDto } from '@repo/api';
import { formatDate } from '@/lib/utils/formatDate';
import { Rating, RatingButton } from '@repo/ui/rating';
import { Button } from '@repo/ui/button';
import { useVoteMyReviewMutation } from '@/lib/store/features/reviews/myReviewApi';
import { useVoteReviewMutation } from '@/lib/store/features/reviews/reviewsApi';

type Props = {
  review: ReviewDto;
  isUser?: boolean; // Only used to style your own review differently
  onEdit?: () => void;
  onDelete?: () => void;
  onReply?: () => void;
};

export default function Review({
  review,
  isUser,
  onEdit,
  onDelete,
  onReply,
}: Props) {
  const [voteMyReview] = useVoteMyReviewMutation();
  const [voteReview] = useVoteReviewMutation();

  const handleVote = async (value: 1 | -1 | 0) => {
    try {
      if (isUser) await voteMyReview({ reviewId: review.id, value });
      else
        await voteReview({
          reviewId: review.id,
          value,
        });
    } catch (err) {
      console.error('Failed to vote review', err);
    }
  };

  return (
    <article
      className={`border-2 rounded-xl p-4 mb-4 ${
        isUser ? 'border-green-500' : 'border-gray-300'
      }`}
    >
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <strong>{isUser ? 'You' : review.reviewer.username}</strong>
          <span>rated</span>
          <Rating value={review.rating} readOnly>
            {Array.from({ length: 5 }).map((_, idx) => (
              <RatingButton key={idx} />
            ))}
          </Rating>
        </div>
        <div className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
          {review.createdAt !== review.updatedAt && (
            <span className="font-semibold ml-1">(edited)</span>
          )}
        </div>
      </div>

      <p className="mb-4">{review.content}</p>

      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          <Button
            className={`${review.userVote === 1 ? 'bg-green-500' : 'bg-gray-500'}`}
            onClick={() => handleVote(review.userVote === 1 ? 0 : 1)}
          >
            👍
          </Button>
          <p>{review.totalVotes}</p>
          <Button
            className={`${review.userVote === -1 ? 'bg-red-500' : 'bg-gray-500'}`}
            onClick={() => handleVote(review.userVote === -1 ? 0 : -1)}
          >
            👎
          </Button>
        </div>

        <Button onClick={onReply}>Reply</Button>

        {isUser && onEdit && onDelete && (
          <>
            <Button onClick={onEdit}>Edit</Button>
            <Button onClick={onDelete}>Delete</Button>
          </>
        )}
      </div>
    </article>
  );
}
