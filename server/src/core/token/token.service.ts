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
import { RefreshTokenRepository } from 'src/entities/refresh-token/refresh-token.repository';
import { ConfigService } from '@nestjs/config';
import { RefreshToken } from 'src/entities/refresh-token/refresh-token.entity';
import { AuthTokens } from 'src/modules/auth/auth.interface';

type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(RefreshTokenRepository) private readonly refreshTokenRepository: RefreshTokenRepository
  ) {}
  async createAccessToken(payload: AccessTokenPayload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
  async createRefreshToken(userId: number): Promise<string> {
    const refreshTokenPayload = { id: userId };

    const token = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const refreshToken = RefreshToken.create(userId, token);
    this.refreshTokenRepository.save(refreshToken);

    return token;
  }

  async updateRefreshToken(refreshToken: RefreshToken): Promise<string> {
    const refreshTokenPayload = { id: refreshToken.userId };

    const token = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });

    const newRefreshToken = refreshToken.update(token);
    this.refreshTokenRepository.save(newRefreshToken);

    return token;
  }

  async refresh(refreshToken: string, payload: AccessTokenPayload): Promise<AuthTokens> {
    try {
      const decodedToken = this.verifiedToken<RefreshTokenPayload>(refreshToken);
      const target = await this.refreshTokenRepository.findByUserId(decodedToken.id, refreshToken);

      if (!target) {
        throw new HttpException('RefreshToken이 존재하지 않습니다', HttpStatus.NOT_FOUND);
      }

      const newAccessToken = await this.createAccessToken(payload);
      const newRefreshToken = await this.updateRefreshToken(target);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
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
