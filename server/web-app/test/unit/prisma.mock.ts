const mockModel = () => ({
  findMany: jest.fn(),
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

export const createPrismaMock = () => {
  const models = ['review', 'comment', 'user', 'vote'];
  return Object.fromEntries(models.map((m) => [m, mockModel()]));
};
