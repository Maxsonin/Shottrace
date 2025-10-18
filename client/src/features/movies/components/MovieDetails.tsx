import type { Movie } from '../types/movie.type';
import {
  Box,
  CardContent,
  CardMedia,
  Typography,
  Card,
  Tabs,
  Tab,
} from '@mui/material';
import CastList from './CastList';
import { useState } from 'react';
import MovieHeader from './MovieHeader';

type MovieDetailsProps = {
  movie: Movie;
};

export default function MovieDetails({ movie }: MovieDetailsProps) {
  const [tab, setTab] = useState(0);

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
          <MovieHeader movie={movie} />

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
