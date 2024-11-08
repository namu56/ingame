import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisConfig = (configService: ConfigService) => {
  return {
    host: configService.get('REDIS_HOST'),
    port: Number(configService.get('REDIS_PORT')),
    password: configService.get('REDIS_PASSWORD'),
  };
};
