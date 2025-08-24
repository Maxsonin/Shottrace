import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import ReviewForm from './ReviewForm';
import { useReviews } from '../hooks/useReviews';
import { useUserReview } from '../hooks/useUserReview';
import useVoteReview from '../hooks/useVoteReview';
import ReviewWithComments from './ReviewWithComments';
import { Typography, Box, Button, CircularProgress } from '@mui/material';

export default function Reviews({ movieId }: { movieId: string }) {
  const { user } = useAuth();
  const userId = user?.userId;

  const [writeMode, setWriteMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { userReview, addOrUpdateUserReview, deleteUserReviewHandler } =
    useUserReview(movieId, userId);

  const { reviews, reviewsLoading, reviewsError } = useReviews(movieId, userId);

  const { voteHandler } = useVoteReview(movieId, userId);

  if (reviewsLoading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={2}>
        <CircularProgress />
        <Typography variant="body1" ml={2}>
          Loading reviews...
        </Typography>
      </Box>
    );

  if (reviewsError) console.error(reviewsError);

  return (
    <Box>
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
            <Box mb={4}>
              <Typography
                ml={2}
                component="h5"
                fontSize={24}
                fontWeight="bold"
                mb={2}
              >
                Your review
              </Typography>
              <ReviewWithComments
                review={userReview}
                isUser
                onChange={() => setEditMode(true)}
                onVoteReview={voteHandler}
                onDelete={deleteUserReviewHandler}
              />
            </Box>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => setWriteMode(true)}
              sx={{ margin: 'auto', display: 'block', my: 2 }}
            >
              Write a review
            </Button>
          )}
        </>
      )}

      <Typography ml={2} component="h5" fontSize={24} fontWeight="bold">
        Reviews
      </Typography>

      <Box mt={1}>
        {reviews.length === 0 &&
          (!userReview ? (
            <Typography ml={2} fontSize={18}>
              It's empty here🤷‍♂️
            </Typography>
          ) : (
            <Typography ml={2} fontSize={18}>
              Only you reviewed this movie👀
            </Typography>
          ))}
        {reviews.map((review) => (
          <ReviewWithComments
            key={review.id}
            review={review}
            isUser={false}
            onVoteReview={voteHandler}
          />
        ))}
      </Box>
    </Box>
  );
}
