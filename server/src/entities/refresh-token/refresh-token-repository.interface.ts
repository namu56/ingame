import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { RefreshToken } from './refresh-token.entity';
import { DeleteResult } from 'typeorm';

export const REFRESH_TOKEN_REPOSITORY_KEY = 'refreshTokenRepositoryKey';

export interface IRefreshTokenRepository extends IGenericRepository<RefreshToken> {
  findByUserId(userId: number, token: string): Promise<RefreshToken | null>;
  deleteByToken(refreshToken: string): Promise<DeleteResult>;
}
