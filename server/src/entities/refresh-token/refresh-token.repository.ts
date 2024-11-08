import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { IRefreshTokenRepository } from './refresh-token-repository.interface';
import { RefreshToken } from './refresh-token.entity';
import { EntityTarget } from 'typeorm';

export class RefreshTokenRepository
  extends GenericTypeOrmRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  getName(): EntityTarget<RefreshToken> {
    return RefreshToken.name;
  }

  async findByUserId(userId: number): Promise<RefreshToken | null> {
    return await this.getRepository()
      .createQueryBuilder('refreshToken')
      .where('refreshToken.user_id = :userId', { userId })
      .getOne();
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.getRepository().delete({ userId });
  }
}
