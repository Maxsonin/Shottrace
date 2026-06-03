export type TmdbMovie = {
  id: number;
  title: string;
  release_date?: string; // "YYYY-MM-DD"
  overview?: string;
  tagline?: string;
  poster_path?: string;
  backdrop_path?: string;
  runtime?: number; // min
  credits?: { cast: Cast[]; crew: Crew[] };
};

export type Cast = {
  id: number;
  name: string;
  character: string;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
};
