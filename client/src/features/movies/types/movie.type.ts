export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genres: { name: string }[];
  runtime: number;
  budget: number;
};

export type MovieStats = {
  likedCount: number;
  watchedCount: number;
};

export type MovieWithStats = Movie & MovieStats;
