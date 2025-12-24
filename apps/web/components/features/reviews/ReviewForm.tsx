'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import type { UpdateReviewDto } from '@repo/api';

import { Button } from '@repo/ui/button';
import { Rating, RatingButton } from '@repo/ui/rating';
import { Textarea } from '@repo/ui/textarea';

interface ReviewFormData {
  initialContent?: string;
  initialRating?: number;
}

interface Props {
  data: ReviewFormData;
  onSubmit: (data: UpdateReviewDto) => void;
  onClose: () => void;
}

// USE REACT FORM LATER
export default function ReviewForm({ data, onSubmit, onClose }: Props) {
  const { initialContent = '', initialRating = 0 } = data;

  const [content, setContent] = useState(initialContent);
  const [rating, setRating] = useState(initialRating);

  const isWritingNewReview = initialContent === '' && initialRating === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Please write your review.');
      return;
    }

    if (rating <= 0) {
      alert('Please select a star rating.');
      return;
    }

    onSubmit({ content, rating });
    setContent('');
    setRating(0);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 p-6 rounded-2xl"
    >
      <div className="flex justify-between">
        <h5 className="text-xl font-bold">
          {isWritingNewReview ? 'Write a Review' : 'Edit Review'}
        </h5>
        <Button onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <p className="mr-2">Your Rating:</p>
        <Rating
          value={rating}
          onValueChange={(value) => {
            console.log('rating changed:', value);
            setRating(value);
          }}
          className="flex"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} />
          ))}
        </Rating>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        placeholder="Write your review here..."
        className="mb-4 min-h-[100px] resize-none"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-green-500 text-white hover:bg-green-600"
        >
          {isWritingNewReview ? 'Submit Review' : 'Update Review'}
        </Button>
      </div>
    </form>
  );
}
