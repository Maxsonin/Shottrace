import { useState } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import {
  FaArrowUp,
  FaTrash,
  FaEdit,
  FaReply,
  FaArrowDown,
} from 'react-icons/fa';
import CommentForm from './CommentForm';
import type { Comment } from '../types/comment.type';
import { formatDate } from '@/shared/utils/dataFormatter';
import { getBgColor } from '../utils/comments';

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
          <div
            key={comment.id}
            className="mt-3 pl-4"
            style={{
              marginLeft: `${level * 20}px`,
              borderLeft: isUserComment
                ? '8px solid #3b82f6'
                : '2px solid #d1d5db',
            }}
          >
            <div
              className="shadow-md rounded-xl p-3 transition flex flex-col"
              style={{ backgroundColor: bgColor }}
            >
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <strong className="text-black">
                  {isUserComment ? 'You' : comment.commenter.username}
                </strong>

                <span className="flex items-center text-green-600">
                  <FaArrowUp className="mr-1" />
                  {comment.votes}
                </span>

                <span className="ml-3 text-xs text-gray-400">
                  {formatDate(comment.createdAt)}
                </span>
              </p>

              <p className="mt-2 text-gray-700">{comment.content}</p>

              {user &&
                (isEditing || isReplying ? (
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
                ) : (
                  <div className="mt-3 flex gap-4 text-sm">
                    <button
                      onClick={() =>
                        onVoteComment({
                          commentId: comment.id,
                          userId: user.userId,
                          value: comment.userVote === 1 ? 0 : 1,
                        })
                      }
                      className={`cursor-pointer flex items-center gap-1 transition 
                        ${
                          comment.userVote === 1
                            ? 'text-green-600 font-bold'
                            : 'text-gray-700 hover:text-green-600'
                        }`}
                    >
                      <FaArrowUp /> Like
                    </button>

                    <button
                      onClick={() =>
                        onVoteComment({
                          commentId: comment.id,
                          userId: user.userId,
                          value: comment.userVote === -1 ? 0 : -1,
                        })
                      }
                      className={`cursor-pointer flex items-center gap-1 transition 
                        ${
                          comment.userVote === -1
                            ? 'text-red-600 font-bold'
                            : 'text-gray-700 hover:text-red-600'
                        }`}
                    >
                      <FaArrowDown /> DisLike
                    </button>

                    <button
                      onClick={() => setReplyCommentId(comment.id)}
                      className=" text-gray-700 cursor-pointer flex items-center gap-1 hover:text-purple-600 transition"
                    >
                      <FaReply /> Reply
                    </button>

                    {isUserComment && (
                      <>
                        <button
                          onClick={() => setEditCommentId(comment.id)}
                          className="text-gray-700 cursor-pointer flex items-center gap-1 hover:text-blue-600 transition"
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          onClick={() => onDelete(comment.id)}
                          className="text-gray-700 cursor-pointer flex items-center gap-1 hover:text-red-600 transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
            </div>

            {comment.children?.length > 0 && (
              <CommentThread
                comments={comment.children}
                level={level + 1}
                onVoteComment={onVoteComment}
                onDelete={onDelete}
                addOrUpdateUserComment={addOrUpdateUserComment}
              />
            )}
          </div>
        );
      })}
    </>
  );
}
