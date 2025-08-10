import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const globalPrefix = configService.get<string>('api.globalPrefix')!;
  const port = configService.get<number>('server.port')!;
  const frontendOrigin = configService.get<string>('cors.origin')!;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: frontendOrigin,
    credentials: true,
  });

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(port);
}
bootstrap();
