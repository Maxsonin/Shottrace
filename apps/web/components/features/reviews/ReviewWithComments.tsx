'use client';

import { useState } from 'react';
import { ReviewDto as ReviewType, UpdateReviewDto } from '@repo/api';
import CommentForm from '../comments/CommentForm';
import CommentsTree from '../comments/CommentsTree';
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from '@/lib/store/features/comments/commentsApi';
import {
  useDeleteMyReviewMutation,
  useUpdateMyReviewMutation,
} from '@/lib/store/features/reviews/myReviewApi';
import ReviewForm from './ReviewForm';
import Review from './Review';
import { useAppSelector } from '@/lib/store/hooks';
import { selectCommentsForReview } from '@/lib/store/features/comments/commentsSlice';

type Props = {
  review: ReviewType;
  isUser: boolean;
};

export default function ReviewWithComments({ review, isUser }: Props) {
  const [showComments, setShowComments] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { isLoading } = useGetCommentsQuery(review.id, { skip: !showComments });
  const comments = useAppSelector(selectCommentsForReview(review.id));

  const [isEditing, setIsEditing] = useState(false);

  const [updateReview] = useUpdateMyReviewMutation();
  const [deleteReview] = useDeleteMyReviewMutation();
  const [createComment] = useCreateCommentMutation();

  const handleUpdate = async (data: UpdateReviewDto) => {
    try {
      await updateReview({
        reviewId: review.id,
        data: { content: data.content, rating: data.rating },
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update review', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    try {
      await deleteReview(review.id).unwrap();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  return (
    <div className="mt-6">
      {isEditing ? (
        <ReviewForm
          data={{
            initialContent: review.content,
            initialRating: review.rating,
          }}
          onSubmit={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <Review
          review={review}
          isUser={isUser}
          onReply={() => setIsReplying(true)}
          onEdit={() => {
            setIsEditing(true);
            setShowComments(false);
          }}
          onDelete={handleDelete}
        />
      )}

      {!isEditing && (
        <div className="mt-1 ml-4 text-sm text-blue-600 cursor-pointer">
          <span onClick={() => setShowComments((s) => !s)}>
            {showComments ? 'Hide replies' : 'View replies'}
          </span>
        </div>
      )}

      {isReplying && (
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <CommentForm
            data={{ reviewId: review.id }}
            onCreate={(data) => {
              createComment(data);
              setIsReplying(false);
            }}
            onClose={() => setIsReplying(false)}
          />
        </div>
      )}

      {!isEditing && showComments && (
        <div className="mt-2">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            <CommentsTree comments={comments} />
          )}
        </div>
      )}
    </div>
  );
}
