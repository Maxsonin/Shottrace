'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';

export default function MovieTabs() {
  const [tab, setTab] = useState('cast');

  return (
    <Tabs value={tab} onValueChange={setTab} className="mt-4">
      <TabsList className="flex gap-2">
        <TabsTrigger value="cast">Cast</TabsTrigger>
        <TabsTrigger value="crew">Crew</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>

      <TabsContent value="cast">
        <p>Cast List goes here</p>
      </TabsContent>
      <TabsContent value="crew">
        <p>Crew List goes here</p>
      </TabsContent>
      <TabsContent value="details">
        <p>Movie details go here</p>
      </TabsContent>
    </Tabs>
  );
}
