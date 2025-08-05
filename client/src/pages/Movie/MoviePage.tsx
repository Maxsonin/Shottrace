import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Movie, MoviesStats } from '../../types/movie.type';

type MovieWithStats = Movie & MoviesStats;

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

type Comment = {
  id: number;
  content: string;
  rating: number;
  deleted: boolean;
  parentId: number | null;
  commenter: {
    username: string;
  } | null;
  children: Comment[];
};

type Review = {
  id: number;
  content: string;
  stars: number;
  rating: number;
  deleted: boolean;
  reviewer: {
    username: string;
  } | null;
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

  const fetchReviews = async (cursor: number | null = null) => {
    const cursorParam = cursor ? `&cursor=${cursor}` : '';
    const response = await fetch(
      `http://localhost:3000/api/reviews/${id}?limit=10${cursorParam}`
    );
    const data = await response.json();
    console.log(data);
    setReviews(data.data);
    setNextCursor(data.nextCursor || null);
  };

  const renderComments = (comments: Comment[], level = 0) => {
    return comments.map((comment) => (
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
          <strong>{comment.commenter?.username || 'Hidden'}</strong>
        </p>
        <p>{comment.content}</p>

        {comment.children && comment.children.length > 0 && (
          <div>{renderComments(comment.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    setReviews([]);
    fetchReviews();

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
          likedCount: Math.floor(Math.random() * 1000), // dummy data
          watchedCount: Math.floor(Math.random() * 1000), // dummy data
        };
        setMovie(movieWithStats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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

      {reviews.map((review) => (
        <div key={review.id} style={{ marginTop: '1rem' }}>
          <p>
            <strong>{review.reviewer?.username}</strong> rated {review.stars}⭐
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
