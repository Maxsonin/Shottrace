import { useState } from 'react';
import ReviewElement from './ReviewElement';
import type { Review } from '../types/reviews.type';
import ReviewComments from '@/features/comments/components/ReviewComments';
import { Box, Typography } from '@mui/material';
import useComments from '@/features/comments/hooks/useComments';
import type { Comment } from '@/features/comments/types/comment.type';

type Props = {
  review: Review;
  isUser: boolean;
  onVoteReview: (reviewId: number, value: 1 | -1 | 0, isUser: boolean) => void;
  onChange?: (review: Review) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewWithComments(props: Props) {
  const { review, isUser, onVoteReview, onChange, onDelete } = props;
  const [replying, setReplying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const initialComments: Comment[] = review.comments || [];

  const { comments, addOrUpdateUserComment, deleteUserComment, onVoteComment } =
    useComments(initialComments);

  const topCommentsCount = comments.filter((c) => c.parentId === null).length;
  return (
    <Box>
      <ReviewElement
        review={review}
        isUser={isUser}
        onVoteReview={onVoteReview}
        onChange={onChange}
        onDelete={onDelete}
        onReply={() => {
          setReplying(true);
          setShowComments(true);
        }}
      />

      {(topCommentsCount > 0 || replying) && (
        <Box mt={1} ml={2}>
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            {showComments
              ? 'Hide replies'
              : `View all ${topCommentsCount} replies`}
          </Typography>
        </Box>
      )}

      <ReviewComments
        reviewId={review.id}
        replying={replying}
        setReplying={setReplying}
        showComments={showComments}
        setShowComments={setShowComments}
        comments={comments}
        addOrUpdateUserComment={addOrUpdateUserComment}
        deleteUserComment={deleteUserComment}
        onVoteComment={onVoteComment}
      />
    </Box>
  );
}
