import { useAuth } from '@/app/providers/AuthProvider';
import type { Review } from '../types/reviews.type';

type Props = {
  review: Review;
  isUser: boolean;
  onVoteReview: (reviewId: number, value: 1 | -1 | 0, isUser: boolean) => void;
  onChange?: (review: Review) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewElement({
  review,
  isUser,
  onVoteReview,
  onChange,
  onDelete,
}: Props) {
  const { user } = useAuth();

  return (
    <div
      className="mt-4 p-4 rounded-xl border bg-gray-800"
      style={{ borderColor: isUser ? 'blue' : 'white' }}
    >
      <p className="font-semibold">
        {isUser ? 'You' : review.reviewer.username} rated{' '}
        <span className="text-yellow-500">{review.stars}⭐</span>
        Rating: {review.votes}
      </p>
      <p className="mt-2">{review.content}</p>

      <div className="mt-3 flex gap-2">
        {user && isUser && (
          <>
            <button
              onClick={() => onChange?.(review)}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete?.(review.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={() =>
            onVoteReview(review.id, review.userVote === 1 ? 0 : 1, isUser)
          }
          className={`px-3 py-1 rounded-lg ${
            review.userVote === 1
              ? 'bg-green-600 text-black'
              : 'bg-white text-black hover:bg-green-600'
          }`}
        >
          Like
        </button>
        <button
          onClick={() =>
            onVoteReview(review.id, review.userVote === -1 ? 0 : -1, isUser)
          }
          className={`px-3 py-1 rounded-lg ${
            review.userVote === -1
              ? 'bg-red-600 text-black'
              : 'bg-white text-black hover:bg-red-600'
          }`}
        >
          Dislike
        </button>
      </div>
    </div>
  );
}
