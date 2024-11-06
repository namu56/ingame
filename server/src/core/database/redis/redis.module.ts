import { REDIS_CLIENT, redisConfig } from '@core/config/redis.config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Redis(redisConfig(configService));
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
