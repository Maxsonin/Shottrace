import { CrewDto } from '@repo/api/movies/dto/credits.dto';
import { Crew } from '../../../infrastructure/clients/tmdb/types/tmdbMovie.type';

// prettier-ignore
// Maps a raw TMDB crew job to the display category we group crew members under
const JOB_TO_CATEGORY: Record<string, string> = {
  'Director': 'Director',
  'Producer': 'Producers',
  'Executive Producer': 'Exec. Producer',
  'Associate Producer': 'Producers',
  'Screenplay': 'Writer',
  'Novel': 'Original Writer',
  'Casting': 'Casting',
  'Casting Associate': 'Casting',
  'Editor': 'Editor',
  'First Assistant Editor': 'Editor',
  'Director of Photography': 'Cinematography',
  'First Assistant Director': 'Asst. Directors',
  'Second Assistant Director': 'Asst. Directors',
  'Original Music Composer': 'Composers',
  'Sound Designer': 'Sound',
  'Sound Editor': 'Sound',
  'Sound Re-Recording Mixer': 'Sound',
  'Sound Mixer': 'Sound',
  'Dialogue Editor': 'Sound',
  'ADR Mixer': 'Sound',
  'Foley Artist': 'Sound',
  'Music Editor': 'Sound',
  'Production Design': 'Production Design',
  'Art Direction': 'Art Direction',
  'Set Designer': 'Art Direction',
  'Storyboard Artist': 'Art Direction',
  'Set Decoration': 'Set Decoration',
  'Special Effects Coordinator': 'Special Effects',
  'Special Effects Technician': 'Special Effects',
  'VisualEffects': 'Visual Effects',
  'Visual Effects Supervisor': 'Visual Effects',
  'Visual Effects Producer': 'Visual Effects',
  'Stunts': 'Stunts',
  'Fight Choreographer': 'Stunts',
  'Utility Stunts': 'Stunts',
  'Stunt Coordinator': 'Stunts',
  'Costume Design': 'Costume Design',
  'Key Costumer': 'Costume Design',
  'Makeup Artist': 'Makeup',
  'Key Makeup Artist': 'Makeup',
  'Prosthetic Makeup Artist': 'Makeup',
  'Hairstylist': 'Hairstyling',
  'Key Hair Stylist': 'Hairstyling',
};

export function groupCrewByCategory(crew: Crew[]): CrewDto[] {
  const namesByCategory = new Map<string, string[]>();

  for (const member of crew) {
    const category = JOB_TO_CATEGORY[member.job];
    if (!category) continue;

    const existingNames = namesByCategory.get(category) ?? [];
    namesByCategory.set(category, [...existingNames, member.name]);
  }

  return Array.from(namesByCategory, ([category, names]) => ({
    category,
    names: [...names].sort((a, b) => a.localeCompare(b)),
  }));
}

export function extractYear(releaseDate?: string): number | undefined {
  if (!releaseDate) return undefined;

  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? undefined : year;
}
