import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ITokenService } from './interfaces/token-service.interface';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';
import { AuthTokenResponse } from 'src/common/responses/token';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY_KEY,
} from 'src/entities/refresh-token/refresh-token-repository.interface';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REFRESH_TOKEN_REPOSITORY_KEY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}
  async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(instanceToPlain(payload));
  }

  async upsertRefreshToken(userId: number): Promise<string> {
    const refreshTokenPayload = new RefreshTokenPayload(userId);

    const token = await this.jwtService.signAsync(instanceToPlain(refreshTokenPayload), {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    let refreshToken = await this.refreshTokenRepository.findByUserId(userId);

    if (refreshToken) {
      refreshToken.update(token);
    } else {
      refreshToken = RefreshToken.create(userId, token);
    }

    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async deleteToken(refreshToken: string): Promise<void> {
    this.refreshTokenRepository.deleteByToken(refreshToken);
  }

  async refresh(payload: AccessTokenPayload): Promise<AuthTokenResponse> {
    try {
      const newAccessToken = await this.createAccessToken(payload);
      const newRefreshToken = await this.upsertRefreshToken(payload.id);

      return new AuthTokenResponse(newAccessToken, newRefreshToken);
    } catch (error) {
      throw new UnauthorizedException('토큰 갱신에 실패했습니다.');
    }
  }

  async verifiedRefreshToken(refreshToken: string): Promise<RefreshTokenPayload> {
    try {
      const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');
      return await this.jwtService.verifyAsync(refreshToken, { secret: secretKey });
    } catch (error) {
      throw new UnauthorizedException('토큰 검증에 실패했습니다.');
    }
  }
}
