import Link from 'next/link';

type MovieDetailsProps = {
  title: string;
  releaseYear?: number;
  director?: string[];
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
      {director && director.length > 0 && (
        <>
          <span>Directed by </span>
          {director.map((name, index) => (
            <span key={name}>
              <Link href={`/director/${name}`} className="underline">
                {name}
              </Link>
              {index < director.length - 1 && ', '}
            </span>
          ))}
        </>
      )}
    </div>
  );
}
