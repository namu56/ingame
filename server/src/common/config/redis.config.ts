import { RedisModuleOptions } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';

export const redisConfig = (configService: ConfigService): RedisModuleOptions => {
  const redisOptions: RedisOptions = {
    host: configService.get<string>('REDIS_HOST'),
    port: parseInt(configService.get<string>('REDIS_PORT')),
  };

  return {
    type: 'single',
    options: redisOptions,
  };
};
