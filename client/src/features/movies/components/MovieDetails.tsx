import { useQuery } from '@tanstack/react-query';
import type { MovieWithStats } from '../types/movie.type';
import { getMovie } from '../services/movieService';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Card,
  Tabs,
  Tab,
  Link,
} from '@mui/material';
import slugify from 'slugify';

import CastList from './CastList';

type Props = {
  movieId: string;
  setBackgroundImage: (url: string) => void;
};

export default function MovieDetails({ movieId, setBackgroundImage }: Props) {
  const {
    data: movie,
    isPending,
    error,
  } = useQuery<MovieWithStats>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie(movieId),
    staleTime: 1000 * 60 * 60,
  });

  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (movie?.backdrop_path) {
      setBackgroundImage(
        `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
      );
    }
  }, [movie?.backdrop_path, setBackgroundImage]);

  if (error) console.error(error);

  if (isPending)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );

  if (!movie) return null;

  return (
    <Card
      elevation={0}
      sx={{ borderRadius: 2, backgroundColor: 'transparent' }}
    >
      <CardContent sx={{ display: 'flex', gap: 3 }}>
        {/* Poster */}
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          sx={{ width: 250, height: 375, borderRadius: 2 }}
        />

        {/* Info */}
        <Box>
          <Header movie={movie} />

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mt: 2, mb: 2, borderBottom: '1px solid' }}
          >
            <Tab label="Cast" />
            <Tab label="Crew" />
            <Tab label="Details" />
          </Tabs>

          {tab === 0 && <CastList cast={movie.credits.cast} />}
          {tab === 1 && <Typography>Crew</Typography>}
          {tab === 2 && <Typography>Details</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

function Header({ movie }: { movie: MovieWithStats; director?: string }) {
  const movieYear = movie.release_date.split('-')[0];
  const director = movie.credits.crew.find((c) => c.job === 'Director')!.name;

  return (
    <Box>
      <Typography variant="h4" color="text.secondary" fontWeight="bold">
        {movie.title}{' '}
        <Link
          component={RouterLink}
          to={`/movies/year/${movieYear}`}
          fontSize={20}
          color="text.primary"
        >
          {movieYear}
        </Link>
        <>
          <Typography
            component="span"
            fontSize={20}
            ml={2}
            color="text.primary"
          >
            {'Directed by '}
          </Typography>
          <Link
            component={RouterLink}
            to={`/director/${slugify(director, { lower: true })}`}
            fontSize={20}
            color="text.secondary"
          >
            {director}
          </Link>
        </>
      </Typography>

      {movie.tagline && (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', pb: 2 }}>
          {movie.tagline}
        </Typography>
      )}

      <Typography>{movie.overview}</Typography>
    </Box>
  );
}
