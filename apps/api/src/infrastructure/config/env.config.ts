import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  // App
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65535)
  PORT: number = 3000;

  // Prisma database connection
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  // Security
  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_EXPIRATION: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_EXPIRATION: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL: string;

  // Google OAuth
  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_REDIRECT_URI: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_UI_REDIRECT_URI: string;

  // TMDB
  @IsString()
  @IsNotEmpty()
  TMDB_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  TMDB_BASE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const missingVars = errors.map((error) => {
      return `${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`;
    });

    throw new Error(
      `\n\n ❌ Missing or invalid environment variables:\n` +
        missingVars.map((v) => `  - ${v}`).join('\n') +
        `\n`,
    );
  }

  console.log(`✅ Environment variables validated successfully\n`);

  return validatedConfig;
}
