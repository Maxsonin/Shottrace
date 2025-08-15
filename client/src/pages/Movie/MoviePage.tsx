import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type {
  Comment,
  Movie,
  MoviesStats,
  Review,
} from '../../types/movie.type';
import { useAuth } from '../../providers/AuthProvider';
import ReviewForm from '../../components/ReviewForm';
import {
  createReview,
  deleteReview,
  fetchMovieReviews,
  fetchMyReview,
  updateReview,
} from '../../api/services/movieService';

type MovieWithStats = Movie & MoviesStats;

function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const [writeReview, setWriteReview] = useState(false);
  const [editReview, setEditReview] = useState(false);

  const { user } = useAuth();
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

  const fetchReviews = async () => {
    if (!id) return;
    try {
      const data = await fetchMovieReviews(id);
      console.log(data);
      setReviews(data.reviews);
    } catch {
      setError('Failed to fetch reviews');
    }
  };

  const fetchUserReview = async () => {
    if (!id) return;
    try {
      const review = await fetchMyReview(id);
      setUserReview(review);
    } catch {
      setUserReview(null);
    }
  };

  const addOrUpdateUserReview = async (data: {
    reviewId?: string | number;
    movieId?: string;
    content: string;
    stars: number;
  }) => {
    try {
      let response: Review;
      if (data.reviewId) {
        response = await updateReview(data.reviewId, data);
        setEditReview(false);
      } else {
        response = await createReview(data);
        setWriteReview(false);
      }
      setUserReview(response);
    } catch {
      setUserReview(null);
    }
  };

  const deleteUserReview = async (reviewId: number) => {
    try {
      await deleteReview(reviewId);
      setUserReview(null);
    } catch {
      setUserReview(null);
    }
  };

  const dataFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const renderComments = (comments: Comment[], level = 0) => (
    <>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            marginLeft: `${level * 20}px`,
            borderLeft: '2px solid #ddd',
            paddingLeft: '10px',
            marginTop: '0.5rem',
          }}
        >
          <p>
            <strong>{comment.commenter.username}</strong> Rating:{' '}
            {comment.rating}{' '}
            {dataFormatter.format(Date.parse(comment.createdAt))}
          </p>
          <p>{comment.content}</p>

          {comment.children.length > 0 &&
            renderComments(comment.children, level + 1)}
        </div>
      ))}
    </>
  );

  // Fetch movie data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Movie not found');
        return res.json();
      })
      .then((data) => {
        const movieWithStats: MovieWithStats = {
          id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          overview: data.overview,
          likedCount: Math.floor(Math.random() * 1000),
          watchedCount: Math.floor(Math.random() * 1000),
        };
        setMovie(movieWithStats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    fetchReviews();
  }, [id]);

  // Fetch user review if logged in
  useEffect(() => {
    if (!id || !user) return;
    fetchUserReview();
  }, [id, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!movie) return null;

  return (
    <div>
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <div>Liked: {movie.likedCount}</div>
      <div>Watched: {movie.watchedCount}</div>

      <h2>Reviews</h2>

      {user &&
        (userReview ? (
          editReview ? (
            <ReviewForm
              onSubmit={addOrUpdateUserReview}
              onClose={() => setEditReview(false)}
              data={{
                reviewId: userReview.id,
                initialContent: userReview.content,
                initialStars: userReview.stars,
              }}
            />
          ) : (
            <div
              key={userReview.id}
              style={{
                marginTop: '1rem',
                backgroundColor: 'green',
                border: '1px solid white',
                padding: '1rem',
              }}
            >
              <p>
                <strong>{userReview.reviewer.username}</strong> rated{' '}
                {userReview.stars}⭐ Rating: {userReview.rating}
                <button
                  className="bg-amber-500 cursor-pointer mr-1"
                  onClick={() => setEditReview(true)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 cursor-pointer"
                  onClick={() => deleteUserReview(userReview.id)}
                >
                  Delete
                </button>
              </p>
              <p>{userReview.content}</p>
              <div style={{ marginTop: '1rem' }}>
                {renderComments(userReview.comments)}
              </div>
            </div>
          )
        ) : writeReview ? (
          <ReviewForm
            onSubmit={addOrUpdateUserReview}
            onClose={() => setWriteReview(false)}
            data={{ movieId: id }}
          />
        ) : (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg mb-4"
            onClick={() => setWriteReview(true)}
          >
            Write a review
          </button>
        ))}

      {reviews
        .filter((review) => review.id !== userReview?.id)
        .map((review) => (
          <div key={review.id} style={{ marginTop: '1rem' }}>
            <p>
              <strong>{review.reviewer.username}</strong> rated {review.stars}⭐
              Rating: {review.rating}
            </p>
            <p>{review.content}</p>
            <div style={{ marginTop: '1rem' }}>
              {renderComments(review.comments)}
            </div>
          </div>
        ))}
    </div>
  );
}

export default MoviePage;
