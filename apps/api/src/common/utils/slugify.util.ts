import slugify from 'slugify';

export function createMovieSlug(title: string, year: number): string {
  return slugify(`${title} ${year}`, {
    lower: true,
    strict: true,
  });
}
