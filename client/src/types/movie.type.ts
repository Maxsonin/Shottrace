export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
};

export type MoviesStats = {
  likedCount: number;
  watchedCount: number;
};

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
