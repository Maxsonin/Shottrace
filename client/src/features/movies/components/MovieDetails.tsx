import { useQuery } from '@tanstack/react-query';
import type { MovieWithStats } from '../types/movie.type';
import { getMovie } from '../services/movieService';
import { useEffect, useState } from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  Card,
  Tabs,
  Tab,
} from '@mui/material';

type Props = {
  movieId: string;
  setBackgroundImage: (url: string) => void;
};

export default function MovieDetails({ movieId, setBackgroundImage }: Props) {
  const {
    data: movie,
    isPending: moviePending,
    error: movieError,
  } = useQuery<MovieWithStats>({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie(movieId),
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (movie?.backdrop_path) {
      setBackgroundImage(
        `https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`
      );
    }
  }, [movie?.backdrop_path, setBackgroundImage]);

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (movieError) console.error(movieError);

  if (moviePending)
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
      sx={{
        borderRadius: 2,
        backgroundColor: 'transparent',
      }}
    >
      <CardContent sx={{ display: 'flex', gap: 3 }}>
        <CardMedia
          component="img"
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          sx={{ width: 250, borderRadius: 2 }}
        />
        <Box>
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{
              fontWeight: 'bold',
            }}
          >
            {movie.title}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ fontStyle: 'italic', pb: 2 }}
          >
            {movie.tagline}
          </Typography>
          <Typography>{movie.overview}</Typography>

          {/* TODO: Add stats */}
          <Box>
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                mt: 2,
                mb: 2,
                borderBottom: '1px solid',
              }}
            >
              <Tab label="Cast" />
              <Tab label="Crew" />
              <Tab label="Details" />
            </Tabs>

            {value === 0 && <Typography>Cast</Typography>}
            {value === 1 && <Typography>Crew</Typography>}
            {value === 2 && <Typography>Details</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
