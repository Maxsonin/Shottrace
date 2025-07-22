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
