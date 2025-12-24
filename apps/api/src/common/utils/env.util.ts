export const NODE_ENV = process.env.NODE_ENV || 'development';

export const isDev = NODE_ENV === 'development';
export const isProd = NODE_ENV === 'production';
export const isTest = NODE_ENV === 'test';
