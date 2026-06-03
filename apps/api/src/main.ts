import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from './shared/exception/prisma.exception';
import {
  getSwaggerConfig,
  swaggerCustomOptions,
} from './infrastructure/config/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

function setupValidation(app: INestApplication) {
  const requestValidationPipe = new ValidationPipe({
    whitelist: true, // Strips unknown properties
    forbidNonWhitelisted: true, // Throws an error if unknown properties are sent
    transform: true, // Converts payload into a DTO class instance (will also perform conversion of primitive types)
  });

  app.useGlobalPipes(requestValidationPipe);
}

function setupCors(app: INestApplication, configService: ConfigService) {
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
}

function setupSwagger(app: INestApplication) {
  const config = getSwaggerConfig();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupValidation(app);
  setupCors(app, configService);
  setupSwagger(app);

  app.use(cookieParser());

  app.useGlobalFilters(new PrismaExceptionFilter());

  const port = configService.getOrThrow<number>('PORT');

  await app.listen(port, '0.0.0.0');
  console.log(`NestJS is running on port ${port}`);
}

void bootstrap();
