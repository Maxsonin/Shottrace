export type Movie = {
  id: number;
  title: string;
  tagline: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genres: { name: string }[];
  runtime: number;
  budget: number;
  credits: {
    cast: { name: string; character: string; cast_id: number }[];
    crew: { job: string; name: string }[];
  };
};

export type MovieStats = {
  likedCount: number;
  watchedCount: number;
};

export type MovieWithStats = Movie & MovieStats;
