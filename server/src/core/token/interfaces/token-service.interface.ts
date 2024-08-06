import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';

export const TOKEN_SERVICE_KEY = 'tokenServiceKey';

export interface ITokenService {
  createAccessToken(payload: AccessTokenPayload): Promise<string>;
  createRefreshToken(userId: number): Promise<string>;
  updateRefreshToken(userId: number, refreshToken: RefreshToken): Promise<string>;
  deleteToken(userId: number): Promise<void>;
  refresh(refreshToken: string, payload: AccessTokenPayload): Promise<AuthTokenResponse>;
  verifiedRefreshToken(refreshToken: string): Promise<RefreshTokenPayload>;
}
