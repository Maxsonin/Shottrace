import CommentForm from '@/features/comments/components/CommentForm';
import CommentThread from '@/features/comments/components/CommentThread';
import { buildCommentTree } from '@/features/comments/utils/comments';
import { useAuth } from '@/app/providers/AuthProvider';
import { Box, Collapse, Divider } from '@mui/material';
import theme from '@/shared/themes/default';
import type { Comment } from '../types/comment.type';

type Props = {
  reviewId: number;
  replying: boolean;
  setReplying: (v: boolean) => void;
  showComments: boolean;
  setShowComments: (v: boolean) => void;
  comments: Comment[];
  addOrUpdateUserComment: (data: {
    reviewId?: number;
    commentId?: number;
    parentId?: number | null;
    content: string;
  }) => Promise<void>;
  deleteUserComment: (commentId: number) => Promise<void>;
  onVoteComment: (data: {
    commentId: number;
    userId: number;
    value: 1 | -1 | 0;
  }) => Promise<void>;
};

export default function ReviewComments({
  reviewId,
  replying,
  setReplying,
  showComments,
  setShowComments,
  comments,
  addOrUpdateUserComment,
  deleteUserComment,
  onVoteComment,
}: Props) {
  const { user } = useAuth();

  const topCommentsCount = comments.filter((c) => c.parentId === null).length;

  return (
    <Box>
      {(topCommentsCount > 0 || replying) && (
        <>
          <Collapse in={showComments}>
            <Divider sx={{ mb: 2, mt: 1 }} />
            {replying && user && (
              <Box
                sx={{
                  mt: 1,
                  pl: 2,
                  borderLeft: '4px solid',
                  borderLeftColor: theme.palette.customColors.like,
                }}
              >
                <CommentForm
                  onSubmit={(data) => {
                    addOrUpdateUserComment({
                      ...data,
                      reviewId,
                      parentId: null,
                    });
                    setReplying(false);
                    setShowComments(true);
                  }}
                  onClose={() => setReplying(false)}
                  data={{ initialContent: '', reviewId }}
                />
              </Box>
            )}
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
