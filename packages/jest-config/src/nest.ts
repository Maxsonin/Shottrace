import type { Config } from 'jest';
import { config as baseConfig } from './base';

export const nestConfig: Config = {
  ...baseConfig,
  rootDir: 'src',

  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    // ignore folders
    '/node_modules/',
    '/generated/',
    '/coverage/',
    '/config/',
    '/prisma/',

    // ignore patterns
    '\\.dto\\.ts$',
    '\\.type\\.ts$',
    '\\.docs\\.ts$',
    '\\.module\\.ts$',

    // ignore files
    'main.ts',
    'app.module.ts',
  ],
};
