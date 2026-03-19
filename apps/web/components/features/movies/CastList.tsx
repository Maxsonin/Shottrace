import { CastDto as Cast } from '@repo/api/movies/dto/credits.dto';
import { Badge } from '@repo/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@repo/ui/tooltip';

export default function CastList({ cast }: { cast: Cast[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cast.map((actor: Cast) => (
        <Tooltip key={actor.id}>
          <TooltipTrigger asChild>
            <Badge>{actor.name}</Badge>
          </TooltipTrigger>
          <TooltipContent sideOffset={4}>{actor.character}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
