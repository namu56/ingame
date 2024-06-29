import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';
import { TokenPayload } from 'src/common/types/token';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';

export const TOKEN_SERVICE_KEY = 'tokenServiceKey';

export interface ITokenService {
  createAccessToken(payload: AccessTokenPayload): Promise<string>;
  createRefreshToken(paylaod: RefreshTokenPayload, id: number): Promise<string>;
  updateRefreshToken(paylaod: RefreshTokenPayload, refreshToken: RefreshToken): Promise<string>;
  refresh(
    refreshToken: string,
    accessTokenPayload: AccessTokenPayload,
    refreshTokenPayload: RefreshTokenPayload
  ): Promise<AuthTokenResponse>;
  verifiedToken<T extends TokenPayload>(token: string): Promise<T>;
}
