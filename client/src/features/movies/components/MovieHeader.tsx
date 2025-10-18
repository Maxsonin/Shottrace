import { Box, Link, Typography } from '@mui/material';
import type { Movie } from '../types/movie.type';
import { Link as RouterLink } from 'react-router-dom';
import slugify from 'slugify';

export default function MovieHeader({
  movie,
}: {
  movie: Movie;
  director?: string;
}) {
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
