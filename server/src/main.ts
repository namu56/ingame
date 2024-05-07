import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT'));
  const origin = configService.get<string>('CORS_ORIGIN');

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
