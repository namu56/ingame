import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { RedisModule } from './redis.module';
import { REDIS_CLIENT } from '@core/config/redis.config';

const redisTestConfig = {
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  REDIS_PASSWORD: 'test',
};

describe('Redis Connection Test', () => {
  let module: TestingModule;
  let redis: Redis;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => redisTestConfig],
        }),
        RedisModule,
      ],
    }).compile();

    redis = module.get<Redis>(REDIS_CLIENT);
  });

  afterAll(async () => {
    await redis.quit();
    await module.close();
  });

  it('Redis server와 성공적으로 연결되는지 확인', async () => {
    const ping = await redis.ping();
    expect(ping).toBe('PONG');
  });
});
