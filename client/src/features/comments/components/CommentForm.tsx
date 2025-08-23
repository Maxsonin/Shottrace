import React, { useState } from 'react';

interface CommentFormData {
  initialContent?: string;
  commentId?: number;
  reviewId: number;
  parentId?: number | null;
}

interface CommentFormProps {
  onSubmit: (data: {
    reviewId: number;
    commentId?: number;
    parentId?: number | null;
    content: string;
  }) => void;
  onClose: () => void;
  data: CommentFormData;
}

const CommentForm = ({ onSubmit, onClose, data }: CommentFormProps) => {
  const { initialContent = '', commentId, reviewId, parentId } = data;
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return alert('Please write your comment.');

    onSubmit({ reviewId, commentId, parentId, content });
    setContent('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-black rounded-xl shadow-lg max-w-lg"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">
          {commentId ? 'Edit Comment' : 'Write a Comment'}
        </h2>
      </div>

      <textarea
        className="w-full border rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={4}
        placeholder="Write your comment here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg"
      >
        {commentId ? 'Update Comment' : 'Submit Comment'}
      </button>
    </form>
  );
};

export default CommentForm;
