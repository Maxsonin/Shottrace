'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { MovieDto as Movie } from '@repo/api';
import CastList from './CastList';
import CrewList from './CrewList';

export default function MovieTabs({ movie }: { movie: Movie }) {
  const [tab, setTab] = useState('cast');

  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-4">
      <TabsList className="flex gap-2">
        <TabsTrigger value="cast">Cast</TabsTrigger>
        <TabsTrigger value="crew">Crew</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      {movie.cast && movie.cast.length > 0 && (
        <TabsContent value="cast">
          <CastList cast={movie.cast} />
        </TabsContent>
      )}

      {movie.crew && movie.crew.length > 0 && (
        <TabsContent value="crew">
          <CrewList crew={movie.crew} />
        </TabsContent>
      )}

      <TabsContent value="details">
        <p>Movie details go here</p>
      </TabsContent>
    </Tabs>
  );
}
