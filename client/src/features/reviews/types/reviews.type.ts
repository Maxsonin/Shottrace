import type { Comment } from '@/features/comments/types/comment.type';

export type Review = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  votes: number;
  userVote: number;
  stars: number;
  reviewer: {
    id: number;
    username: string;
  };
  comments: Comment[];
};
