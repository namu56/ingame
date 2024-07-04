import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { WinstonLoggerService } from './core/logger/winston-logger.service';
import { setupSwagger } from './core/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.get(WinstonLoggerService);

  const configService = app.get(ConfigService);
  const port = parseInt(configService.get<string>('PORT'));
  const origin = configService.get<string>('CORS_ORIGIN');

  setupSwagger(app);
  app.use(cookieParser());
  app.enableCors({
    origin: origin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(port);
}
bootstrap();
