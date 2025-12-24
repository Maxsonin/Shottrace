export interface TmdbMovie {
  id: number;
  title: string;
  release_date: string; // "YYYY-MM-DD"
  overview?: string;
  tagline?: string;
  poster_path?: string;
  backdrop_path?: string;
  runtime?: number;
  credits: { crew: Crew[] };
}

export interface Crew {
  id: number;
  job: string;
  name: string;
}
