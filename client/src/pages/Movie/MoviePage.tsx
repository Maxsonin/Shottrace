import { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie, MoviesStats } from '../../types/movie.type';
import { useAuth } from '../../providers/AuthProvider';
import api from '../../api/axios';
import ReviewForm from '../../components/ReviewForm';

type MovieWithStats = Movie & MoviesStats;

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

type Comment = {
  id: number;
  content: string;
  rating: number;
  parentId: number | null;
  commenter: {
    username: string;
  };
  children: Comment[];
};

type Review = {
  id: number;
  content: string;
  stars: number;
  rating: number;
  reviewer: {
    username: string;
  };
  comments: Comment[];
};

function MoviePage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const [writeReview, setWriteReview] = useState(false);
  const [editReview, setEditReview] = useState(false);

  const { user } = useAuth();

  const fetchReviews = async (cursor: number | null = null) => {
    if (!id) return;
    const cursorParam = cursor ? `&cursor=${cursor}` : '';
    const response = await api.get(
      `/reviews/${id}/public?limit=10${cursorParam}`
    );
    const data = response.data;

    if (cursor) {
      setReviews((prev) => [...prev, ...(data.data || [])]);
    } else {
      setReviews(data.data || []);
    }

    setNextCursor(data.nextCursor || null);
  };

  const fetchUserReview = async () => {
    if (!id) return;
    try {
      const response = await api.get(`/reviews/${id}/user`);
      setUserReview(response.data);
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
      if (data.reviewId) {
        // Update review
        const response = await api.put(`/reviews`, data);
        setUserReview(response.data);
        setEditReview(false);
      } else if (data.movieId) {
        // Add new review
        const response = await api.post(`/reviews`, data);
        setUserReview(response.data);
        setWriteReview(false);
      } else {
        throw new Error('Missing reviewId or movieId');
      }
    } catch {
      setUserReview(null);
    }
  };

  const deleteUserReview = async (id: number) => {
    try {
      await api.delete(`/reviews/${id}`);
      setUserReview(null);
    } catch {
      setUserReview(null);
    }
  };

  const renderComments = (comments: Comment[], level = 0) => {
    return comments ? (
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
              <strong>{comment.commenter.username}</strong>
            </p>
            <p>{comment.content}</p>

            {comment.children && comment.children.length > 0 && (
              <div>{renderComments(comment.children, level + 1)}</div>
            )}
          </div>
        ))}
      </>
    ) : null;
  };

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

  useEffect(() => {
    if (!id) return;
    setReviews([]);
    setNextCursor(null);
    fetchReviews();
  }, [id]);

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
      {user ? (
        userReview ? (
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
                <strong>{userReview.reviewer?.username}</strong> rated{' '}
                {userReview.stars}⭐
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
            data={{
              movieId: id,
            }}
          />
        ) : (
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg mb-4"
            onClick={() => setWriteReview(true)}
          >
            Write a review
          </button>
        )
      ) : (
        <h1>Log in to write a review</h1>
      )}

      {reviews
        .filter((review) => review.id !== userReview?.id)
        .map((review) => (
          <div key={review.id} style={{ marginTop: '1rem' }}>
            <p>
              <strong>{review.reviewer.username}</strong> rated {review.stars}⭐
            </p>
            <p>{review.content}</p>
            <div style={{ marginTop: '1rem' }}>
              {renderComments(review.comments)}
            </div>
          </div>
        ))}

      {nextCursor && (
        <button
          onClick={() => {
            setLoadingMore(true);
            fetchReviews(nextCursor).finally(() => setLoadingMore(false));
          }}
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load more reviews'}
        </button>
      )}
    </div>
  );
}

export default MoviePage;
