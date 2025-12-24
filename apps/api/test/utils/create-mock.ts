export function createMock<T>(defaults: Partial<T>): T {
  return { ...defaults } as T;
}
