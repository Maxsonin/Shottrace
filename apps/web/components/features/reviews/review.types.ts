export type SortOptions = 'createdAt' | 'totalVotes';
export type ReviewsPerPageOptions = 5 | 10 | 25;

export type FilterOptions = {
  limit: number;
  sortBy: SortOptions;
  rating: number | null;
};
