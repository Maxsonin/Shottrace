export const formatDate = (date: string | number | Date, locale?: string) => {
  if (!date) return '';

  const d =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;

  const formatter = new Intl.DateTimeFormat(locale ?? undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return formatter.format(d);
};
