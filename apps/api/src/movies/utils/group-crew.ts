import { Crew } from 'src/tmdb/types/tmdb.type';

export interface GroupedCrewItem {
  category: string;
  names: string[];
}

export function groupCrewByCategory(crew: Crew[]): GroupedCrewItem[] {
  const categoryMap: Record<string, string> = {
    Director: 'Director',
    Producer: 'Producers',
    'Executive Producer': 'Exec. Producer',
    'Associate Producer': 'Producers',
    Screenplay: 'Writer',
    Novel: 'Original Writer',
    Casting: 'Casting',
    'Casting Associate': 'Casting',
    Editor: 'Editor',
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
    VisualEffects: 'Visual Effects',
    'Visual Effects Supervisor': 'Visual Effects',
    'Visual Effects Producer': 'Visual Effects',
    Stunts: 'Stunts',
    'Fight Choreographer': 'Stunts',
    'Utility Stunts': 'Stunts',
    'Stunt Coordinator': 'Stunts',
    'Costume Design': 'Costume Design',
    'Key Costumer': 'Costume Design',
    'Makeup Artist': 'Makeup',
    'Key Makeup Artist': 'Makeup',
    'Prosthetic Makeup Artist': 'Makeup',
    Hairstylist: 'Hairstyling',
    'Key Hair Stylist': 'Hairstyling',
  };

  const groupedMap: Record<string, string[]> = {};

  crew.forEach((member: Crew) => {
    const category = categoryMap[member.job];
    if (!category) return;
    if (!groupedMap[category]) groupedMap[category] = [];
    groupedMap[category].push(member.name);
  });

  const groupedArray: GroupedCrewItem[] = Object.entries(groupedMap).map(
    ([category, names]) => ({
      category,
      names: names.sort((a, b) => a.localeCompare(b)),
    }),
  );

  return groupedArray;
}
