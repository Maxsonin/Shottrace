import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import CommentForm from './CommentForm';
import type { Comment } from '../types/comment.type';
import { formatDate } from '@/shared/utils/dataFormatter';
import { getBgColor } from '../utils/comments';
import Vote from '@/shared/components/ui/Vote';
import { Box, Paper, Typography, Button, Stack } from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import theme from '@/shared/themes/default';

export default function CommentThread({
  comments = [],
  level = 0,
  onVoteComment,
  onDelete,
  addOrUpdateUserComment,
}: {
  comments: Comment[];
  level?: number;
  onVoteComment: (data: {
    commentId: number;
    userId: number;
    value: 1 | -1 | 0;
  }) => void;
  onDelete: (id: number) => void;
  addOrUpdateUserComment: (data: {
    reviewId?: number;
    commentId?: number;
    parentId?: number | null;
    content: string;
  }) => void;
}) {
  const { user } = useAuth();
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<number | null>(null);

  return (
    <>
      {comments.map((comment) => {
        const isUserComment = user?.userId === comment.commenter.id;
        const bgColor = getBgColor(comment.votes);

        const isEditing = editCommentId === comment.id;
        const isReplying = replyCommentId === comment.id;

        return (
          <Box
            key={comment.id}
            sx={{
              mt: 1,
              ml: level * 2,
              pl: 2,
              borderLeft: isUserComment ? '4px solid' : '2px solid',
              borderColor: isUserComment ? 'primary.main' : 'grey.400',
              borderLeftColor: isUserComment
                ? theme.palette.customColors.like
                : 'grey.400',
            }}
          >
            {isEditing ? (
              <CommentForm
                onSubmit={(data) => {
                  addOrUpdateUserComment({ ...data, commentId: comment.id });
                  setEditCommentId(null);
                }}
                onClose={() => setEditCommentId(null)}
                data={{
                  initialContent: comment.content,
                  commentId: comment.id,
                  reviewId: comment.reviewId,
                  parentId: comment.parentId ?? null,
                }}
              />
            ) : (
              <Paper
                elevation={2}
                sx={{
                  py: 2,
                  px: 4,
                  backgroundColor: bgColor,
                }}
              >
                {/* Header */}
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={'space-between'}
                  spacing={2}
                >
                  <Typography fontWeight="bold">
                    {isUserComment ? 'You' : comment.commenter.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.createdAt)}
                  </Typography>
                </Stack>

                {/* Content */}
                <Typography sx={{ mt: 1 }}>{comment.content}</Typography>

                {/* Actions */}
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Vote
                    votes={comment.votes}
                    userVote={comment.userVote}
                    onVote={(value) =>
                      onVoteComment({
                        commentId: comment.id,
                        userId: user.userId,
                        value,
                      })
                    }
                  />

                  <Stack direction="row" spacing={1}>
                    <Button
                      startIcon={<ReplyIcon />}
                      size="small"
                      onClick={() => setReplyCommentId(comment.id)}
                    >
                      Reply
                    </Button>

                    {isUserComment && (
                      <>
                        <Button
                          startIcon={<EditIcon />}
                          size="small"
                          color="primary"
                          onClick={() => setEditCommentId(comment.id)}
                        >
                          Edit
                        </Button>

                        <Button
                          startIcon={<DeleteIcon />}
                          size="small"
                          color="error"
                          onClick={() => onDelete(comment.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            )}

            <Box
              sx={{
                mt: 1,
                ml: level * 2,
                pl: 2,
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                borderLeftColor: theme.palette.customColors.like,
              }}
            >
              {isReplying && (
                <CommentForm
                  onSubmit={(formData) => {
                    addOrUpdateUserComment(formData);
                    setEditCommentId(null);
                    setReplyCommentId(null);
                  }}
                  onClose={() => {
                    setEditCommentId(null);
                    setReplyCommentId(null);
                  }}
                  data={{
                    initialContent: isEditing ? comment.content : '',
                    commentId: isEditing ? comment.id : undefined,
                    reviewId: comment.reviewId,
                    parentId: isReplying ? comment.id : null,
                  }}
                />
              )}
            </Box>

            {comment.children?.length > 0 && (
              <CommentThread
                comments={comment.children}
                level={level + 1}
                onVoteComment={onVoteComment}
                onDelete={onDelete}
                addOrUpdateUserComment={addOrUpdateUserComment}
              />
            )}
          </Box>
        );
      })}
    </>
  );
}
