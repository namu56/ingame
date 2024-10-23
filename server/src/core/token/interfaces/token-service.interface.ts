import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';

export const TOKEN_SERVICE_KEY = 'tokenServiceKey';

export interface ITokenService {
  createAccessToken(payload: AccessTokenPayload): Promise<string>;
  upsertRefreshToken(userId: number): Promise<string>;
  deleteToken(refreshToken: string): Promise<void>;
  refresh(payload: AccessTokenPayload): Promise<AuthTokenResponse>;
  verifiedRefreshToken(refreshToken: string): Promise<RefreshTokenPayload>;
}
