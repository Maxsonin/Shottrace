import Link from 'next/link';

type MovieDetailsProps = {
  title: string;
  releaseYear?: number;
  director?: string;
};

export default function MovieHeader({
  title,
  releaseYear,
  director,
}: MovieDetailsProps) {
  return (
    <div className="flex gap-2">
      <h1 className="font-bold">{title}</h1>
      {releaseYear && (
        <Link href={`/movies/year/${releaseYear}`} className="underline">
          {releaseYear}
        </Link>
      )}
      {director && (
        <>
          <span>Directed by </span>
          <Link href={`/director/${director}`} className="underline">
            {director}
          </Link>
        </>
      )}
    </div>
  );
}
