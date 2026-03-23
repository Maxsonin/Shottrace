### This is my personal pet-project. It grows with me, experimenting with modern web technologies and best practices.

## Getting Started

To install all dependencies and run the project locally, use:

```bash
pnpm install; pnpm dev
```

This project includes the following packages & apps:

## Apps and Packages

```bash
.
├── apps
│   ├── api                       # NestJS app
│   └── web                       # Next.js app
└── packages
    ├── @repo/api                 # Shared `NestJS` resources
    ├── @repo/eslint-config       # `eslint` configurations (includes `prettier`)
    ├── @repo/jest-config         # `jest` configurations
    ├── @repo/typescript-config   # `tsconfig.json`s used throughout the monorepo
    └── @repo/ui                  # Shareable shadcn React component library
```

## In this project used

- [**TypeScript**](https://www.typescriptlang.org/) for static type-safety
- [**ESLint**](https://eslint.org/) for code linting
- [**Prettier**](https://prettier.io) for code formatting
- [**Jest**](https://docs.nestjs.com/fundamentals/testing) for testing
- [**Shadcn**](https://ui.shadcn.com/) for UI
- [**Redux Toolkit Query**](https://redux-toolkit.js.org/rtk-query/overview) for data fetching and caching
- [**Swagger**](https://docs.nestjs.com/openapi/introduction) for API documentation
