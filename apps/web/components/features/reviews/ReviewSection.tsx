'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import type {
  FilterOptions,
  ReviewsPerPageOptions,
  SortOptions,
} from './review.types';
import ReviewWithComments from './ReviewWithComments';
import {
  useCreateMyReviewMutation,
  useGetMyReviewQuery,
} from '@/lib/store/features/reviews/myReviewApi';
import { EmptyState, OnlyUserReview } from './ReviewHelpers';
import { useGetPaginatedReviewsQuery } from '@/lib/store/features/reviews/reviewsApi';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@repo/ui/pagination';
import { Button } from '@repo/ui/button';
import ReviewForm from './ReviewForm';
import { UpdateReviewDto } from '@repo/api';
import ReviewsFilterOptions from './ReviewsFilterOptions';
import { reviewsAdapter } from '@/lib/store/features/reviews/reviewsSlice';

export default function ReviewSection({ movieId }: { movieId: string }) {
  const { user } = useAppSelector((s) => s.auth);
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  const [createMyReview] = useCreateMyReviewMutation();

  const handleMyReviewSubmit = async (formData: UpdateReviewDto) => {
    try {
      const data = {
        movieId,
        content: formData.content,
        rating: formData.rating,
      };
      await createMyReview({ data }).unwrap();
      setIsWriteReviewOpen(false);
    } catch (err) {
      console.error('Failed to create review', err);
    }
  };

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FilterOptions>({
    limit: 5 as ReviewsPerPageOptions,
    sortBy: 'createdAt' as SortOptions,
    rating: null,
  });

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  const { data: myReview, isLoading: myReviewLoading } =
    useGetMyReviewQuery(movieId);

  const { data: reviewsData, isLoading } = useGetPaginatedReviewsQuery({
    movieId,
    page,
    limit: filters.limit,
    sortBy: filters.sortBy,
    ...(filters.rating && { rating: filters.rating }),
  });

  const reviews = useAppSelector((state) =>
    reviewsAdapter.getSelectors().selectAll(state.reviews),
  );

  if (myReviewLoading || isLoading) return <p>Loading reviews...</p>;

  const noReviews = reviews?.length === 0;

  const totalPages = reviewsData?.totalPages ?? 0;

  return (
    <>
      {myReview ? (
        <section>
          <h2 className="text-xl font-bold p-6 mt-10">Your review</h2>
          <ReviewWithComments review={myReview} isUser={true} />
        </section>
      ) : user ? (
        isWriteReviewOpen ? (
          <ReviewForm
            data={{}}
            onSubmit={handleMyReviewSubmit}
            onClose={() => setIsWriteReviewOpen(false)}
          />
        ) : (
          <div className="flex flex-col items-center py-12">
            <div className="p-6">You haven't reviewed this movie yet.</div>
            <Button onClick={() => setIsWriteReviewOpen(true)}>
              Write a review
            </Button>
          </div>
        )
      ) : null}

      {noReviews ? (
        myReview ? (
          <OnlyUserReview />
        ) : (
          <EmptyState emptyBecauseOfFilters={false} />
        )
      ) : (
        <section>
          <ReviewsFilterOptions
            filterOptions={filters}
            updateFilter={updateFilter}
          />

          {reviews?.map((review) => (
            <ReviewWithComments
              key={review.id}
              review={review}
              isUser={false}
            />
          ))}
        </section>
      )}

      {reviews && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page - 1 !== 0 && (
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(p);
                  }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page + 1 <= totalPages && (
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
}
