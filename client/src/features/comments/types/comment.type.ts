export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  votes: number;
  userVote: number;
  reviewId: number;
  parentId: number | null;
  commenter: {
    id: number;
    username: string;
  };
  children: Comment[];
};
