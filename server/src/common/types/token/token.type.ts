import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;
