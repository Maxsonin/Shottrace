'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/button';
import { Textarea } from '@repo/ui/textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { z } from 'zod';
import { wordCount } from '../../../lib/utils/zodWordCount';

interface Props {
  data: {
    initialContent?: string;
    commentId?: string;
    reviewId: string;
    parentId?: string;
  };
  onCreate?: (data: {
    reviewId: string;
    parentId?: string;
    content: string;
  }) => void;
  onUpdate?: (data: {
    reviewId: string;
    commentId: string;
    content: string;
  }) => void;
  onClose: () => void;
}

const commentSchema = z.object({
  content: wordCount(1, 250, 'Comment'),
});
type CommentFormInput = z.infer<typeof commentSchema>;

export default function CommentForm({
  data,
  onCreate,
  onUpdate,
  onClose,
}: Props) {
  const { initialContent = '', commentId, reviewId, parentId } = data;
  const isCreating = !commentId;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CommentFormInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: initialContent },
  });

  const content = watch('content');

  const handleFormSubmit = (values: CommentFormInput) => {
    if (isCreating && onCreate) {
      onCreate({ reviewId, parentId, content: values.content });
    } else if (!isCreating && onUpdate && commentId) {
      onUpdate({ reviewId, commentId, content: values.content });
    }
    onClose();
  };

  return (
    <form className="p-4 relative" onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">
          {isCreating ? 'Write a Comment' : 'Edit Comment'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>

      <Textarea
        {...register('content')}
        placeholder="Write your comment here..."
        className="mb-1 min-h-20 resize-none"
      />
      <p className="text-sm text-gray-500">
        {content.trim().split(/\s+/).filter(Boolean).length} / 300 words
      </p>
      {errors.content && (
        <p className="text-red-500 text-sm mb-3">{errors.content.message}</p>
      )}

      <Button
        type="submit"
        className="bg-green-500 text-white hover:bg-green-600"
        disabled={!isCreating && content === initialContent}
      >
        {isCreating ? 'Submit Comment' : 'Update Comment'}
      </Button>
    </form>
  );
}
