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
  rating: number;
  parentId: number | null;
  commenter: {
    username: string;
  };
  children: Comment[];
};

export type Review = {
  id: number;
  createdAt: string;
  updatedAt: string;
  content: string;
  stars: number;
  rating: number;
  reviewer: {
    username: string;
  };
  comments: Comment[];
};
