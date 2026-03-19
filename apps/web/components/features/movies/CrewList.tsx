import { Badge } from '@repo/ui/badge';
import { CrewDto as Crew } from '@repo/api/movies/dto/credits.dto';

export default function CrewList({ crew }: { crew: Crew[] }) {
  return (
    <div className="flex flex-col gap-4">
      {crew.map((group) => (
        <div key={group.category}>
          <h4 className="font-semibold mb-2">{group.category}</h4>
          <div className="flex flex-wrap gap-2">
            {group.names.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
