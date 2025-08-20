'use client';

import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import ReviewForm from './ReviewForm';
import ReviewElement from './ReviewElement';
import { useReviews } from '../hooks/useReviews';
import { useUserReview } from '../hooks/useUserReview';
import useVoteReview from '../hooks/useVoteReview';

export default function Reviews({ movieId }: { movieId: string }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [writeMode, setWriteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { userReview, addOrUpdateUserReview, deleteUserReviewHandler } =
    useUserReview(movieId, userId);

  const { reviews, reviewsLoading, reviewsError } = useReviews(movieId);

  const { voteHandler } = useVoteReview(movieId, userId);

  if (reviewsLoading) return <div>Loading reviews...</div>;
  if (reviewsError) console.error(reviewsError);
  return (
    <div>
      {user && (
        <>
          {writeMode || editMode ? (
            <ReviewForm
              onSubmit={(data) => {
                addOrUpdateUserReview(data);
                setWriteMode(false);
                setEditMode(false);
              }}
              onClose={() => {
                setWriteMode(false);
                setEditMode(false);
              }}
              data={{
                movieId,
                initialContent: userReview?.content,
                initialStars: userReview?.stars,
                reviewId: userReview?.id,
              }}
            />
          ) : userReview ? (
            <ReviewElement
              review={userReview}
              isUser
              onChange={() => setEditMode(true)}
              onVoteReview={voteHandler}
              onDelete={deleteUserReviewHandler}
            />
          ) : (
            <button onClick={() => setWriteMode(true)}>Write a review</button>
          )}
        </>
      )}

      {reviews.map((review) => (
        <ReviewElement
          key={review.id}
          review={review}
          isUser={user?.userId === review.reviewer.id}
          onVoteReview={voteHandler}
        />
      ))}
    </div>
  );
}
