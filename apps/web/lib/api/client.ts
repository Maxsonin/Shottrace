export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const API_URL = process.env.API_URL ?? 'http://localhost:3000';

type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

// TODO: add SWR for future client side caching
export async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T | null> {
  const { headers, ...rest } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    throw new ApiError(res.status, await res.text());
  }

  return res.json();
}
