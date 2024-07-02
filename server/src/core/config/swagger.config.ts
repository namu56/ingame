import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('InGame API 문서')
    .setDescription('InGame API Swagger 문서입니다.')
    .setVersion('1.0.0')
    .addBasicAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}
