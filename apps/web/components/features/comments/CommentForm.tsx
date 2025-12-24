'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';
import { Textarea } from '@repo/ui/textarea';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

interface CommentFormData {
  initialContent?: string;
  commentId?: string;
  reviewId: string;
  parentId?: string;
}

interface CommentFormProps {
  data: CommentFormData;
  onUpdate?: (data: {
    reviewId: string;
    commentId: string;
    content: string;
  }) => void;
  onCreate?: (data: {
    reviewId: string;
    parentId?: string;
    content: string;
  }) => void;
  onClose: () => void;
}

export default function CommentForm({
  data,
  onUpdate,
  onCreate,
  onClose,
}: CommentFormProps) {
  const { initialContent = '', commentId, reviewId, parentId } = data;
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Please write your comment.');
      return;
    }

    if (commentId && onUpdate) {
      onUpdate({ reviewId, commentId, content });
    } else if (onCreate) {
      onCreate({ reviewId, parentId, content });
    }

    setContent('');
    onClose();
  };

  return (
    <form className="p-4 relative" onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold">
          {commentId ? 'Edit Comment' : 'Write a Comment'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-full"
        >
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>

      {/* Textarea */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.currentTarget.value)}
        placeholder="Write your comment here..."
        className="mb-3 min-h-[80px] resize-none"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        className="bg-green-500 text-white hover:bg-green-600"
      >
        {commentId ? 'Update Comment' : 'Submit Comment'}
      </Button>
    </form>
  );
}
