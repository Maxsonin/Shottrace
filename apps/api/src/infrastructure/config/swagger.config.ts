import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'Shottrace API Docs',
  jsonDocumentUrl: '/docs-json',
  swaggerOptions: {
    persistAuthorization: true,
  },
};

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Shottrace')
    .setDescription('### API documentation for Shottrace')
    .setVersion('0.0.0')
    .build();
}
