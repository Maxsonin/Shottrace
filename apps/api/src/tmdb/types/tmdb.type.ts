export interface TmdbMovie {
  id: number;
  title: string;
  release_date: string; // "YYYY-MM-DD"
  overview?: string;
  tagline?: string;
  poster_path?: string;
  backdrop_path?: string;
  runtime?: number;
  credits: { cast: Cast[]; crew: Crew[] };
}

export interface Cast {
  id: number;
  name: string;
  character: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
}
