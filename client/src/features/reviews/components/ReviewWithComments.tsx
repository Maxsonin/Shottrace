import { useState } from 'react';
import ReviewElement from './ReviewElement';
import type { Review } from '../types/reviews.type';
import ReviewComments from '@/features/comments/components/ReviewComments';
import { Box, Typography } from '@mui/material';

type Props = {
  review: Review;
  isUser: boolean;
  onVoteReview: (reviewId: number, value: 1 | -1 | 0, isUser: boolean) => void;
  onChange?: (review: Review) => void;
  onDelete?: (id: number) => void;
};

export default function ReviewWithComments(props: Props) {
  const { review } = props;
  const [replying, setReplying] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <Box>
      <ReviewElement
        {...props}
        onReply={() => {
          setReplying(true);
          setShowComments(true);
        }}
      />

      {review.comments?.length > 0 && (
        <Box mt={1} ml={2}>
          <Typography
            sx={{ cursor: 'pointer' }}
            onClick={() => setShowComments(!showComments)}
          >
            {showComments
              ? 'Hide Comments'
              : `View all ${review.comments.length} comments`}
          </Typography>
        </Box>
      )}

      <ReviewComments
        reviewId={review.id}
        initialComments={review.comments || []}
        replying={replying}
        setReplying={setReplying}
        showComments={showComments}
        setShowComments={setShowComments}
      />
    </Box>
  );
}
