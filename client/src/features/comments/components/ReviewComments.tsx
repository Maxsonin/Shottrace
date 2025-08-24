import CommentForm from '@/features/comments/components/CommentForm';
import CommentThread from '@/features/comments/components/CommentThread';
import { buildCommentTree } from '@/features/comments/utils/comments';
import useComments from '@/features/comments/hooks/useComments';
import type { Comment } from '@/features/comments/types/comment.type';
import { useAuth } from '@/app/providers/AuthProvider';
import { Box, Collapse, Divider } from '@mui/material';

type Props = {
  reviewId: number;
  initialComments: Comment[];
  replying: boolean;
  setReplying: (v: boolean) => void;
  showComments: boolean;
  setShowComments: (v: boolean) => void;
};

export default function ReviewComments({
  reviewId,
  initialComments,
  replying,
  setReplying,
  showComments,
  setShowComments,
}: Props) {
  const { user } = useAuth();
  const { comments, addOrUpdateUserComment, deleteUserComment, onVoteComment } =
    useComments(initialComments);

  return (
    <Box>
      {comments.length > 0 && (
        <>
          {replying && user && (
            <Box ml={4}>
              <CommentForm
                onSubmit={(data) => {
                  addOrUpdateUserComment({ ...data, reviewId, parentId: null });
                  setReplying(false);
                  setShowComments(true);
                }}
                onClose={() => setReplying(false)}
                data={{ initialContent: '', reviewId }}
              />
            </Box>
          )}

          <Collapse in={showComments}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            <CommentThread
              comments={buildCommentTree(comments)}
              addOrUpdateUserComment={addOrUpdateUserComment}
              onVoteComment={onVoteComment}
              onDelete={deleteUserComment}
            />
          </Collapse>
        </>
      )}
    </Box>
  );
}
