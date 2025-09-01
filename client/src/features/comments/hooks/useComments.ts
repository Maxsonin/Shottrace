import { useEffect, useState } from 'react';
import {
  createComment,
  deleteComment,
  updateComment,
  voteComment,
} from '../services/commentService';
import type { Comment } from '../types/comment.type';

export default function useComments(initialComments: Comment[] = []) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const addOrUpdateUserComment = async (data: {
    reviewId?: number;
    commentId?: number;
    parentId?: number | null;
    content: string;
  }) => {
    let response = data.commentId
      ? await updateComment(data.commentId, data)
      : await createComment(data);

    setComments((prev) => {
      if (data.commentId) {
        return prev.map((c) =>
          c.id === response.id ? { ...c, ...response } : c
        );
      } else {
        return [...prev, response];
      }
    });

    setReplying(false);
  };

  const deleteUserComment = async (commentId: number) => {
    await deleteComment(commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const onVoteComment = async (data: {
    commentId: number;
    userId: number;
    value: 1 | -1 | 0;
  }) => {
    await voteComment(data.commentId, data);

    setComments((prev) =>
      prev.map((c) =>
        c.id === data.commentId
          ? {
              ...c,
              votes: c.votes - c.userVote + data.value,
              userVote: data.value,
            }
          : c
      )
    );
  };

  return {
    comments,
    replying,
    setReplying,
    addOrUpdateUserComment,
    deleteUserComment,
    onVoteComment,
  };
}
