import z from 'zod';

export const wordCount = (min: number, max: number, element: string) =>
  z.string().refine(
    (val) => {
      const trimmed = val.trim();
      if (!trimmed) return false;
      const count = trimmed.split(/\s+/).length;
      return count >= min && count <= max;
    },
    { message: `${element} must be between ${min} and ${max} words` },
  );
