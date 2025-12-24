'use client';

import { Label } from '@repo/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@repo/ui/select';
import { Rating, RatingButton } from '@repo/ui/rating';
import {
  FilterOptions,
  ReviewsPerPageOptions,
  SortOptions,
} from './review.types';
import { Button } from '@repo/ui/button';

type ReviewsFilterOptionsProps = {
  filterOptions: FilterOptions;
  updateFilter: (
    key: keyof FilterOptions,
    value: FilterOptions[keyof FilterOptions],
  ) => void;
};

const SORT_OPTIONS: Record<SortOptions, string> = {
  createdAt: 'Newest',
  totalVotes: 'Votes',
};

const RATING_OPTIONS: ReviewsPerPageOptions[] = [5, 10, 25];

export default function ReviewsFilterOptions({
  filterOptions,
  updateFilter,
}: ReviewsFilterOptionsProps) {
  const { limit, sortBy, rating } = filterOptions;

  return (
    <div className="flex flex-wrap items-center justify-between p-4 gap-4">
      <h2 className="text-xl font-bold">Reviews</h2>

      <div className="flex gap-4 flex-wrap items-center">
        <Button>Clear filters</Button>

        {/* Per page */}
        <div className="flex flex-col w-28">
          <Label>Per page</Label>
          <Select
            value={String(limit)}
            onValueChange={(v: string) => updateFilter('limit', Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATING_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex flex-col w-28">
          <Label>Sort by</Label>
          <Select
            value={sortBy}
            onValueChange={(v: string) =>
              updateFilter('sortBy', v as FilterOptions['sortBy'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Rating</span>
          <Rating
            value={rating ?? 0}
            onValueChange={(v) => updateFilter('rating', v || null)}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <RatingButton key={i} />
            ))}
          </Rating>
        </div>
      </div>
    </div>
  );
}
