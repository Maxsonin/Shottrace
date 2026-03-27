import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './setup-swagger';
import { PrismaExceptionFilter } from './common/exception/prisma.exception';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.use(cookieParser());

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw error on unknown properties
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Automatically convert types based on TypeScript types
      },
    }),
  );

  app.useGlobalFilters(new PrismaExceptionFilter());

  setupSwagger(app);

  await app.listen(port, '0.0.0.0');
  console.log(`NestJS is running on port ${port}`);
}

void bootstrap();
