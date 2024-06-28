import { AccessTokenPayload } from 'src/common/dto/token';
import { AuthTokens } from 'src/modules/auth/auth.interface';

export const TOKEN_SERVICE_KEY = 'tokenServiceKey';

export interface ITokenService {
  createAccessToken(payload: AccessTokenPayload): Promise<string>;
  createRefreshToken(id: number): Promise<string>;
  refresh(refreshToken: string, payload: AccessTokenPayload): Promise<AuthTokens>;
  verifiedToken<T>(token: string): Promise<T>;
}
