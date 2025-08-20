import { useState } from 'react';
import CommentThread from '@/features/comments/components/CommentThread';
import CommentForm from '@/features/comments/components/CommentForm';
import { useAuth } from '@/app/providers/AuthProvider';
import { buildCommentTree } from '@/features/comments/utils/comments';
import useComments from '@/features/comments/hooks/useComments';
import type { Comment } from '@/features/comments/types/comment.type';

type Props = {
  reviewId: number;
  initialComments: Comment[];
};

export default function ReviewComments({ reviewId, initialComments }: Props) {
  const { user } = useAuth();
  const {
    comments,
    replying,
    setReplying,
    addOrUpdateUserComment,
    deleteUserComment,
    onVoteComment,
  } = useComments(initialComments);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="mt-3">
      {user && !replying && (
        <button
          onClick={() => setReplying(true)}
          className="text-base cursor-pointer text-blue-400 hover:underline mt-2 mr-3"
        >
          Reply
        </button>
      )}

      {replying && user && (
        <div className="mt-2 ml-4">
          <CommentForm
            onSubmit={(data) =>
              addOrUpdateUserComment({ ...data, reviewId, parentId: null })
            }
            onClose={() => setReplying(false)}
            data={{ initialContent: '', reviewId }}
          />
        </div>
      )}

      {comments.length > 0 && (
        <>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-base cursor-pointer text-blue-400 hover:underline mt-2"
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>

          {showComments && (
            <div className="mt-2 ml-4">
              <CommentThread
                comments={buildCommentTree(comments)}
                addOrUpdateUserComment={addOrUpdateUserComment}
                onVoteComment={onVoteComment}
                onDelete={deleteUserComment}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
