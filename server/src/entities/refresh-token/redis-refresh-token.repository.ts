import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenRepository } from './refresh-token-repository.interface';
import { REDIS_CLIENT } from '@core/config/redis.config';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RedisRefreshTokenRepository implements IRefreshTokenRepository {
  private readonly REFRESH_TOKEN_PREFIX = 'refresh_token:';

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
    private readonly configService: ConfigService
  ) {}

  async save(t: RefreshToken): Promise<RefreshToken>;
  async save(t: RefreshToken[]): Promise<RefreshToken[]>;
  async save(t: RefreshToken | RefreshToken[]): Promise<RefreshToken | RefreshToken[]> {
    const refreshToken = t as RefreshToken;

    await this.redisClient.set(
      `${this.REFRESH_TOKEN_PREFIX}${refreshToken.userId}`,
      refreshToken.token,
      'EX',
      this.getExpirationTime()
    );
    return refreshToken;
  }

  async findByUserId(userId: number): Promise<RefreshToken | null> {
    const token = await this.redisClient.get(`${this.REFRESH_TOKEN_PREFIX}${userId}`);
    if (!token) return null;
    return RefreshToken.create(userId, token);
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.redisClient.del(`${this.REFRESH_TOKEN_PREFIX}${userId}`);
  }

  private getExpirationTime(): number {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN');
    const days = Number(expiresIn.replace('d', ''));
    return days * 24 * 60 * 60;
  }
}
