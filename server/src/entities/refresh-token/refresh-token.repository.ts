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

  async findByUserId(userId: number, token: string): Promise<RefreshToken> {
    return this.getRepository().findOneBy({ userId, token });
  }
}
