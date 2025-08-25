import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { setupApp } from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('server.port')!;
  const globalPrefix = configService.get<string>('api.globalPrefix')!;
  const frontendOrigin = configService.get<string>('cors.origin')!;

  setupApp(app, { globalPrefix, frontendOrigin });
  setupSwagger(app);

  await app.listen(port);
}
bootstrap();
