export const configServiceMock = {
  getOrThrow: jest.fn((key: string) => {
    const values: Record<string, string> = {
      TMDB_BASE_URL: 'https://api.themoviedb.org/3',
      TMDB_API_KEY: 'test-api-key',
    };

    if (!(key in values)) {
      throw new Error(`Missing config: ${key}`);
    }

    return values[key];
  }),
};
