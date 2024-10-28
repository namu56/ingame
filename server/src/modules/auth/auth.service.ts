import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../entities/user/user.entity';
import { IUserService, USER_SERVICE_KEY } from '../user/interfaces/user-service.interface';
import {
  ITokenService,
  TOKEN_SERVICE_KEY,
} from 'src/core/token/interfaces/token-service.interface';
import { CreateSocialUserRequest } from 'src/common/requests/user';
import { AccessTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';
import { IAuthService } from './interfaces/auth-service.interface';
import { compareValue } from 'src/common/utils/compare-value.util';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE_KEY) private readonly userService: IUserService,
    @Inject(TOKEN_SERVICE_KEY) private readonly tokenService: ITokenService
  ) {}

  async validateLocalUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    const isMatch = await compareValue(password, user.password);

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
    const refreshToken = await this.tokenService.upsertRefreshToken(payload.id);

    return new AuthTokenResponse(accessToken, refreshToken);
  }

  async logout(refreshToken: string): Promise<void> {
    this.tokenService.deleteToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<AuthTokenResponse> {
    const decodedToken = await this.tokenService.verifiedRefreshToken(refreshToken);
    const user = await this.userService.getUserById(decodedToken.id);
    try {
      const payload = new AccessTokenPayload(user.id, user.email);
      return this.tokenService.refresh(payload);
    } catch (error) {
      throw new UnauthorizedException('토큰 재발급에 실패했습니다.');
    }
  }
}
