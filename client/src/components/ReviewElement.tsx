import { useState, useEffect } from 'react';
import CommentThread from './CommentThread';
import CommentForm from './CommentForm';
import type { Review, Comment } from '../types/movie.type';
import {
  createComment,
  deleteComment,
  updateComment,
} from '../api/services/commmentService';
import { useAuth } from '../providers/AuthProvider';

type Props = {
  review: Review;
  isUser?: boolean;
  onChange?: (review: Review) => void;
  onDelete?: (id: number) => void;
};

const onLike = async (reviewId: number) => {};

export default function ReviewElement({
  review,
  isUser,
  onChange,
  onDelete,
}: Props) {
  const [showComments, setShowComments] = useState(false);
  const [replying, setReplying] = useState(false);
  const [comments, setComments] = useState<Comment[]>(review.comments || []);

  const { user } = useAuth();

  useEffect(() => {
    setComments(review.comments || []);
  }, [review.comments]);

  // utils to update comment tree
  function addCommentToTree(
    comments: Comment[],
    parentId: number | null,
    newComment: Comment
  ): Comment[] {
    if (!parentId) {
      return [...comments, newComment];
    }

    return comments.map((c) => {
      if (c.id === parentId) {
        return {
          ...c,
          children: [...(c.children || []), newComment],
        };
      }
      return {
        ...c,
        children: c.children
          ? addCommentToTree(c.children, parentId, newComment)
          : [],
      };
    });
  }

  function updateCommentInTree(
    comments: Comment[],
    updated: Comment
  ): Comment[] {
    return comments.map((c) =>
      c.id === updated.id
        ? { ...c, content: updated.content }
        : { ...c, children: updateCommentInTree(c.children || [], updated) }
    );
  }

  function deleteCommentFromTree(
    comments: Comment[],
    commentId: number
  ): Comment[] {
    return comments
      .filter((c) => c.id !== commentId)
      .map((c) => ({
        ...c,
        children: deleteCommentFromTree(c.children || [], commentId),
      }));
  }

  // actions with comments
  const addOrUpdateUserComment = async (data: {
    reviewId?: number;
    commentId?: number;
    parentId?: number | null;
    content: string;
  }) => {
    let response = data.commentId
      ? await updateComment(data.commentId, data)
      : await createComment(data);

    const normalizedComment: Comment = {
      ...response,
      commenter: {
        id: user.userId,
        username: 'You',
      },
      children: response.children || [],
    };

    setComments((prev) => {
      if (data.commentId) {
        return updateCommentInTree(prev, normalizedComment);
      } else {
        return addCommentToTree(prev, data.parentId || null, normalizedComment);
      }
    });

    setReplying(false);
  };

  const deleteUserComment = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prev) => deleteCommentFromTree(prev, commentId));
  };

  return (
    <div
      className={`mt-4 p-4 rounded-xl border bg-gray-800 ${
        isUser ? 'border-blue-500' : 'border-white'
      }`}
    >
      <p className="font-semibold">
        {isUser ? 'You' : review.reviewer.username} rated{' '}
        <span className="text-yellow-500">{review.stars}⭐</span> Rating:{' '}
        {review.rating}
      </p>

      <p className="mt-2">{review.content}</p>

      <div className="mt-3 flex gap-2">
        {isUser && (
          <>
            <button
              onClick={() => onChange?.(review)}
              className="bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete?.(review.id)}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
        <button
          onClick={() => onLike(review.id)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
        >
          Like
        </button>

        <button
          onClick={() => setReplying(true)}
          className="bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600"
        >
          Reply
        </button>
      </div>

      {replying && (
        <div className="mt-2 ml-4">
          <CommentForm
            onSubmit={(data) =>
              addOrUpdateUserComment({
                ...data,
                reviewId: review.id,
                parentId: null,
              })
            }
            onClose={() => setReplying(false)}
            data={{ initialContent: '', reviewId: review.id }}
          />
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-3">
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>

          {showComments && (
            <div className="mt-2 ml-4">
              <CommentThread
                comments={comments}
                addOrUpdateUserComment={addOrUpdateUserComment}
                onLike={onLike}
                onDelete={deleteUserComment}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
