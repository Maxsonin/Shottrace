import React, { useState } from 'react';
import CloseButton from './UI/CloseButton';

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

const ReviewForm = ({ onSubmit, onClose, data }: ReviewFormProps) => {
  const {
    initialContent = '',
    initialStars = 0,
    reviewId,
    movieId,
  } = data || {};
  const [content, setContent] = useState(initialContent);
  const [stars, setStars] = useState(initialStars);
  const [hoverStars, setHoverStars] = useState<number | null>(null);

  const maxStars = 5;
  const starStep = 0.5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('Please write your review.');
    if (stars <= 0) return alert('Please select a star rating.');

    if (reviewId) {
      onSubmit({ reviewId, content, stars });
    } else if (movieId) {
      onSubmit({ movieId, content, stars });
    } else {
      alert('Missing required data');
    }
  };

  const renderStars = () => {
    const starsArray = [];
    for (let i = 1; i <= maxStars; i++) {
      const activeRating = hoverStars !== null ? hoverStars : stars;

      let fillType: 'empty' | 'half' | 'full' = 'empty';
      if (activeRating >= i) {
        fillType = 'full';
      } else if (activeRating >= i - starStep) {
        fillType = 'half';
      }

      starsArray.push(
        <div
          key={i}
          className="relative w-10 h-10 cursor-pointer"
          onMouseLeave={() => setHoverStars(null)}
        >
          {/* For first star, remove first half button to remove 0.5 stars reviews */}
          {i !== 1 && (
            <button
              type="button"
              className={`absolute inset-y-0 left-0 ${
                i !== 1 ? 'w-1/2' : 'w-full'
              } h-full`}
              onMouseEnter={() => setHoverStars(i - starStep)}
              onClick={() => setStars(i - starStep)}
            />
          )}
          {/* Transparent button for second half */}
          <button
            type="button"
            className="absolute inset-y-0 right-0 w-1/2 h-full"
            onMouseEnter={() => setHoverStars(i)}
            onClick={() => setStars(i)}
          />

          {/* Render star icon based on fillType */}
          {fillType === 'full' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="gold"
              stroke="gold"
              strokeWidth="2"
              className="w-10 h-10"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
          {fillType === 'half' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-10 h-10"
            >
              <defs>
                <linearGradient id={`halfGrad${i}`}>
                  <stop offset="50%" stopColor="gold" />
                  <stop offset="50%" stopColor="transparent" stopOpacity="1" />
                </linearGradient>
              </defs>
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill={`url(#halfGrad${i})`}
                stroke="gold"
                strokeWidth="2"
              />
            </svg>
          )}
          {fillType === 'empty' && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="gold"
              strokeWidth="2"
              className="w-10 h-10"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          )}
        </div>
      );
    }
    return starsArray;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-black rounded-xl shadow-lg max-w-lg"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-3">Write a Review</h2>
        <CloseButton onClick={onClose} />
      </div>

      <textarea
        className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={4}
        placeholder="Write your review here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex items-center space-x-1 mb-3">{renderStars()}</div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
