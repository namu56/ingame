export class AuthTokenResponse {
  constructor(
    readonly accessToken: string,
    readonly refreshToken: string
  ) {}
}
