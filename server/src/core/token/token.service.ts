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
import { TokenPayload } from 'src/common/types/token';
import {
  IRefreshTokenRepository,
  REFRESH_TOKEN_REPOSITORY_KEY,
} from 'src/entities/refresh-token/refresh-token-repository.interface';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REFRESH_TOKEN_REPOSITORY_KEY)
    private readonly refreshTokenRepository: IRefreshTokenRepository
  ) {}
  async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async createRefreshToken(payload: RefreshTokenPayload, userId: number): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = RefreshToken.create(userId, token);
    this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async updateRefreshToken(
    paylaod: RefreshTokenPayload,
    refreshToken: RefreshToken
  ): Promise<string> {
    const token = await this.jwtService.signAsync(paylaod, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    refreshToken.update(token);
    this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async refresh(
    refreshToken: string,
    accessTokenPayload: AccessTokenPayload,
    refreshTokenPayload: RefreshTokenPayload
  ): Promise<AuthTokenResponse> {
    try {
      const decodedToken = await this.verifiedToken<RefreshTokenPayload>(refreshToken);
      const target = await this.refreshTokenRepository.findByUserId(decodedToken.id, refreshToken);

      if (!target) {
        throw new HttpException('refreshToken이 존재하지 않습니다', HttpStatus.NOT_FOUND);
      }

      const newAccessToken = await this.createAccessToken(accessTokenPayload);
      const newRefreshToken = await this.updateRefreshToken(refreshTokenPayload, target);

      return new AuthTokenResponse(newAccessToken, newRefreshToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async verifiedToken<T extends TokenPayload>(token: string): Promise<T> {
    try {
      const secretKey = this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY');
      return await this.jwtService.verifyAsync(token, { secret: secretKey });
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
