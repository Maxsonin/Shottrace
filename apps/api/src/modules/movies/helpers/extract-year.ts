export function extractYear(releaseDate?: string): number | undefined {
  if (!releaseDate) return undefined;

  const year = Number(releaseDate.slice(0, 4));
  return Number.isNaN(year) ? undefined : year;
}
