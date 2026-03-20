'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@repo/ui/button';
import { Rating, RatingButton } from '@repo/ui/rating';
import { Textarea } from '@repo/ui/textarea';
import {
  createReviewSchema,
  updateReviewSchema,
  CreateReviewInput,
  UpdateReviewInput,
} from '../../../lib/schemas/review';

interface Props {
  data: {
    initialContent?: string;
    initialRating?: number;
    movieId?: string;
  };
  onSubmit: (data: CreateReviewInput | UpdateReviewInput) => void;
  onClose: () => void;
}

export default function ReviewForm({ data, onSubmit, onClose }: Props) {
  const { initialContent = '', initialRating = 0, movieId } = data;
  const isCreating = Boolean(movieId);

  const schema = isCreating ? createReviewSchema : updateReviewSchema;

  const initialValues = {
    content: initialContent,
    rating: initialRating,
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateReviewInput>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const rating = watch('rating');
  const content = watch('content');

  const handleFormSubmit = (values: UpdateReviewInput) => {
    if (isCreating) {
      onSubmit({ ...values, movieId });
    } else {
      onSubmit(values);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="border border-gray-200 p-6 rounded-2xl"
    >
      <div className="flex justify-between">
        <h5 className="text-xl font-bold">
          {isCreating ? 'Write a Review' : 'Edit Review'}
        </h5>
        <Button onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </Button>
      </div>

      <div className="flex items-center mb-4">
        <p className="mr-2">Your Rating:</p>
        <Rating
          value={rating}
          onValueChange={(value) =>
            setValue('rating', value, { shouldValidate: true })
          }
          className="flex"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <RatingButton key={index} />
          ))}
        </Rating>
        {errors.rating && (
          <p className="text-red-500 text-sm">{errors.rating.message}</p>
        )}
      </div>

      <Textarea
        {...register('content')}
        placeholder="Write your review here..."
        className="mb-1 min-h-[100px] resize-none"
      />
      <p className="text-sm text-gray-500">
        {content.trim().split(/\s+/).filter(Boolean).length} / 450 words
      </p>
      {errors.content && (
        <p className="text-red-500 text-sm mb-4">{errors.content.message}</p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-green-500 text-white hover:bg-green-600"
          disabled={
            !isCreating &&
            content === initialValues.content &&
            rating === initialValues.rating
          }
        >
          {isCreating ? 'Submit Review' : 'Update Review'}
        </Button>
      </div>
    </form>
  );
}
