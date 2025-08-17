import { data, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { getMovie } from '../../api/services/movieService';
import {
  fetchMovieReviews,
  fetchMyReview,
  createReview,
  updateReview,
  deleteReview,
} from '../../api/services/reviewService';

import MovieDetails from '../../components/MovieDetails';
import ReviewList from '../../components/ReviewList';
import ReviewForm from '../../components/ReviewForm';
import ReviewElement from '../../components/ReviewElement';

import type { Movie, MoviesStats, Review } from '../../types/movie.type';
import { createComment } from '../../api/services/commmentService';

type MovieWithStats = Movie & MoviesStats;

export default function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [movie, setMovie] = useState<MovieWithStats | null>(null);
  const [movieLoading, setMovieLoading] = useState(true);
  const [movieError, setMovieError] = useState<unknown>();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<unknown>();

  const [userReview, setUserReview] = useState<Review | null>(null);
  const [writeReview, setWriteReview] = useState(false);
  const [editReview, setEditReview] = useState(false);

  // Fetch movie
  useEffect(() => {
    if (!id) return;

    setMovieLoading(true);
    getMovie(id)
      .then((data) => {
        setMovie({
          ...data,
          likedCount: Math.floor(Math.random() * 1000), // temporary mock
          watchedCount: Math.floor(Math.random() * 1000),
        });
        setMovieError(undefined);
      })
      .catch((err) => setMovieError(err))
      .finally(() => setMovieLoading(false));
  }, [id]);

  // Fetch all reviews except user's review
  useEffect(() => {
    if (!id) return;

    setReviewsLoading(true);
    fetchMovieReviews(id)
      .then((data) => {
        const filtered = userReview
          ? data.reviews.filter((r) => r.id !== userReview.id)
          : data.reviews;
        setReviews(filtered);
        setReviewsError(undefined);
      })
      .catch((err) => setReviewsError(err))
      .finally(() => setReviewsLoading(false));
  }, [id, userReview]);

  // Fetch user review
  useEffect(() => {
    if (!id || !user) return;

    fetchMyReview(id)
      .then((data) => setUserReview(data || null))
      .catch(() => setUserReview(null));
  }, [id, user]);

  // Review actions
  const addOrUpdateUserReview = async (data: {
    reviewId?: string | number;
    movieId?: string;
    content: string;
    stars: number;
  }) => {
    let response: Review;

    if (data.reviewId) {
      response = await updateReview(data.reviewId, data);
      setUserReview((prev) =>
        prev
          ? {
              ...prev,
              content: response.content,
              stars: response.stars,
              updatedAt: response.updatedAt,
            }
          : response
      );
      setEditReview(false);
    } else {
      response = await createReview(data);
      setUserReview(response);
      setWriteReview(false);
    }
  };

  const deleteUserReviewHandler = async (reviewId: number) => {
    await deleteReview(reviewId);
    setUserReview(null);
  };

  if (movieLoading) return <div>Loading...</div>;
  if (movieError) return <div>{String(movieError)}</div>;
  if (!movie) return null;

  return (
    <div>
      <MovieDetails {...movie} />

      <h2>Reviews</h2>

      {user && (
        <>
          {writeReview || editReview ? (
            <ReviewForm
              onSubmit={addOrUpdateUserReview}
              onClose={() => {
                setWriteReview(false);
                setEditReview(false);
              }}
              data={{
                movieId: id,
                initialContent: userReview?.content,
                initialStars: userReview?.stars,
                reviewId: userReview?.id,
              }}
            />
          ) : userReview ? (
            <ReviewElement
              review={userReview}
              isUser
              onChange={() => setEditReview(true)}
              onDelete={(id) => deleteUserReviewHandler(id)}
            />
          ) : (
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg mb-4"
              onClick={() => setWriteReview(true)}
            >
              Write a review
            </button>
          )}
        </>
      )}

      {!reviewsLoading && <ReviewList reviews={reviews} />}

      {reviewsError && <div>{String(reviewsError)}</div>}
    </div>
  );
}
