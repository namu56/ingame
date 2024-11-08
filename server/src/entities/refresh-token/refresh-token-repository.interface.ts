import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { RefreshToken } from './refresh-token.entity';

export const REFRESH_TOKEN_REPOSITORY_KEY = 'refreshTokenRepositoryKey';

export interface IRefreshTokenRepository extends IGenericRepository<RefreshToken> {
  findByUserId(userId: number): Promise<RefreshToken | null>;
  deleteByUserId(userId: number): Promise<void>;
}
