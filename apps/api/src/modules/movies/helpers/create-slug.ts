import slugify from 'slugify';

export function createMovieSlug(params: {
  title: string;
  year?: number;
}): string {
  const { title, year } = params;

  const base = year ? `${title} ${year}` : title;

  return slugify(base, {
    lower: true,
    strict: true,
  });
}
