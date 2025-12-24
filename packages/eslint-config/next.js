import { config as baseConfig } from './base.js';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export const nextJsConfig = [
  ...baseConfig,
  ...nextVitals,
  ...nextTs,
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];
