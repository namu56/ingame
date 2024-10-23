import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { IRefreshTokenRepository } from './refresh-token-repository.interface';
import { RefreshToken } from './refresh-token.entity';
import { DeleteResult, EntityTarget } from 'typeorm';

export class RefreshTokenRepository
  extends GenericTypeOrmRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  getName(): EntityTarget<RefreshToken> {
    return RefreshToken.name;
  }

  findByUserId(userId: number): Promise<RefreshToken> {
    return this.getRepository().findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async deleteByToken(refreshToken: string): Promise<DeleteResult> {
    return await this.getRepository().delete({ token: refreshToken });
  }
}
