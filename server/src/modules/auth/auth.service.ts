import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user/user.entity';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { IUserService, USER_SERVICE_KEY } from '../user/interfaces/user-service.interface';
import {
  ITokenService,
  TOKEN_SERVICE_KEY,
} from 'src/core/token/interfaces/token-service.interface';
import { CreateSocialUserRequest } from 'src/common/requests/user';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE_KEY) private readonly userService: IUserService,
    @Inject(TOKEN_SERVICE_KEY) private readonly tokenService: ITokenService,
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) {}

  async validateLocalUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async validateSocialUser(createSocialUserRequest: CreateSocialUserRequest): Promise<User | null> {
    const user = await this.userService.findUserByEmail(createSocialUserRequest.email);
    if (!user) return null;
    if (createSocialUserRequest.provider !== user.provider) {
      throw new HttpException(
        `이 이메일은 이미 ${user.provider}계정을 통해 등록되었습니다.`,
        HttpStatus.CONFLICT
      );
    }
    return user;
  }

  async login(payload: AccessTokenPayload): Promise<AuthTokenResponse> {
    const accessToken = await this.tokenService.createAccessToken(payload);
    const refreshToken = await this.tokenService.createRefreshToken(payload.id);

    return new AuthTokenResponse(accessToken, refreshToken);
  }

  async logout(userId: number): Promise<void> {
    this.tokenService.deleteToken(userId);
  }

  async refresh(refreshToken: string): Promise<AuthTokenResponse> {
    try {
      const decodedToken = await this.tokenService.verifiedRefreshToken(refreshToken);
      const user = await this.userService.findUserById(decodedToken.id);

      const payload = new AccessTokenPayload(user.id, user.email);
      return this.tokenService.refresh(refreshToken, payload);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
