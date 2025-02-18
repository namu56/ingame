import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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

  async createRefreshToken(userId: number): Promise<string> {
    const refreshTokenPayload = new RefreshTokenPayload(userId);

    const token = await this.jwtService.signAsync(instanceToPlain(refreshTokenPayload), {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = RefreshToken.create(userId, token);
    this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async updateRefreshToken(userId: number, refreshToken: RefreshToken): Promise<string> {
    const refreshTokenPayload = new RefreshTokenPayload(userId);

    const token = await this.jwtService.signAsync(instanceToPlain(refreshTokenPayload), {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    refreshToken.update(token);
    await this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async deleteToken(refreshToken: string): Promise<void> {
    this.refreshTokenRepository.deleteByToken(refreshToken);
  }

  async refresh(refreshToken: string, payload: AccessTokenPayload): Promise<AuthTokenResponse> {
    const target = await this.refreshTokenRepository.findByUserId(payload.id, refreshToken);

    if (!target) {
      throw new HttpException('refreshToken이 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    try {
      const newAccessToken = await this.createAccessToken(payload);
      const newRefreshToken = await this.updateRefreshToken(payload.id, target);

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
