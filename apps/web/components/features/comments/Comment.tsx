'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/button';
import { formatDate } from '@/lib/utils/formatDate';
import type { CommentWithChildren } from './CommentsTree';
import CommentForm from './CommentForm';
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useUpdateCommentMutation,
  useVoteCommentMutation,
} from '@/lib/store/features/comments/commentsApi';
import { useAppSelector } from '@/lib/store/hooks';

interface CommentProps {
  comment: CommentWithChildren;
  depth: number;
}

export default function Comment({ comment, depth }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const { user } = useAppSelector((s) => s.auth);
  const isUser = user?.id === comment.commenter.id;

  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [voteComment] = useVoteCommentMutation();
  const [createComment] = useCreateCommentMutation();

  const handleVote = (value: 1 | -1 | 0) => {
    voteComment({
      commentId: comment.id,
      value,
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      deleteComment({ commentId: comment.id });
    }
  };

  const handleUpdate = (updatedContent: string) => {
    updateComment({
      commentId: comment.id,
      content: updatedContent,
    });
    setIsEditing(false);
  };

  return (
    <div className="pl-4 border-l border-gray-300">
      {isEditing ? (
        <CommentForm
          data={{
            reviewId: comment.reviewId,
            commentId: comment.id,
            initialContent: comment.content,
          }}
          onUpdate={(data) => handleUpdate(data.content)}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="rounded-xl p-3 shadow-sm border-2 border-gray-300">
            <div className="flex justify-between">
              <strong>{isUser ? 'You' : comment.commenter.username}</strong>
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
                {comment.createdAt !== comment.updatedAt && ' (edited)'}
              </span>
            </div>

            <p className="mt-2">{comment.content}</p>

            <div className="flex gap-2 mt-3">
              <Button
                className={`${comment.userVote === 1 ? 'bg-green-500' : 'bg-gray-500'}`}
                onClick={() => handleVote(comment.userVote === 1 ? 0 : 1)}
              >
                👍
              </Button>
              {comment.totalVotes}
              <Button
                className={`${comment.userVote === -1 ? 'bg-red-500' : 'bg-gray-500'}`}
                onClick={() => handleVote(comment.userVote === -1 ? 0 : -1)}
              >
                👎
              </Button>

              {user && (
                <Button
                  className="bg-green-500"
                  onClick={() => setIsReplying((s) => !s)}
                >
                  Reply
                </Button>
              )}

              {isUser && (
                <>
                  <Button
                    className="bg-orange-500"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button className="bg-red-500" onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
          {isReplying && (
            <div className="mt-3 pl-4 border-l border-green-400">
              <CommentForm
                data={{ reviewId: comment.reviewId, parentId: comment.id }}
                onCreate={(data) => {
                  createComment(data);
                  setIsReplying(false);
                }}
                onClose={() => setIsReplying(false)}
              />
            </div>
          )}
        </>
      )}

      {comment.children.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.children.map((child) => (
            <Comment key={child.id} comment={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
