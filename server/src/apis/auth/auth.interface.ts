export interface AccessTokenPayload {
  id: number;
  email: string;
}

export interface RefreshTokenPayload {
  id: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
