import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ReviewFormData {
  initialContent?: string;
  initialStars?: number;
  reviewId?: string | number;
  movieId?: string;
}

interface ReviewFormProps {
  onSubmit: (data: {
    reviewId?: string | number;
    movieId?: string;
    content: string;
    stars: number;
  }) => void;
  onClose: () => void;
  data?: ReviewFormData;
}

function ReviewForm({ onSubmit, onClose, data }: ReviewFormProps) {
  const {
    initialContent = '',
    initialStars = 0,
    reviewId,
    movieId,
  } = data || {};

  const [content, setContent] = useState(initialContent);
  const [stars, setStars] = useState<number>(initialStars);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Please write your review.');
      return;
    }

    if (stars <= 0) {
      alert('Please select a star rating.');
      return;
    }

    if (reviewId) {
      onSubmit({ reviewId, content, stars });
    } else if (movieId) {
      onSubmit({ movieId, content, stars });
    } else {
      alert('Missing required data');
    }

    setContent('');
    setStars(0);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 4,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 600,
        mx: 'auto',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">
          {initialContent ? 'Edit Review' : 'Write a Review'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Stack>

      <Box display="flex" alignItems="center" mb={3}>
        <Typography mr={1} component="legend">
          Your Rating:
        </Typography>
        <Rating
          name="review-rating"
          size="large"
          value={stars}
          precision={0.5}
          onChange={(_, newValue) => setStars(newValue || 0)}
        />
      </Box>

      <TextField
        label="Review"
        placeholder="Write your review here..."
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewForm;
