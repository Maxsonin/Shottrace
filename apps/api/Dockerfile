FROM node:20-slim

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api ./apps/api
COPY packages/api ./packages/api
COPY packages/eslint-config ./packages/eslint-config
COPY packages/jest-config ./packages/jest-config
COPY packages/typescript-config ./packages/typescript-config

WORKDIR /app/apps/api

RUN pnpm --filter api... install --frozen-lockfile

RUN pnpm exec prisma generate

RUN pnpm run build

EXPOSE 3000
CMD ["node", "dist/src/main.js"]