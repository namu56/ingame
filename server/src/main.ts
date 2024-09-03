import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { setupSwagger, winstonLogger } from './core/config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ValidationException } from '@core/exceptions/validation.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    })
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new ValidationException(errors),
      transform: true,
    })
  );

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
