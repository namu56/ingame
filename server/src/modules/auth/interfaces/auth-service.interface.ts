import { AccessTokenPayload } from 'src/common/dto/token';
import { CreateSocialUserRequest } from 'src/common/requests/user';
import { AuthTokenResponse } from 'src/common/responses/token';
import { User } from 'src/entities/user/user.entity';

export const AUTH_SERVICE_KEY = 'authServiceKey';

export interface IAuthService {
  validateLocalUser(email: string, password: string): Promise<Omit<User, 'password'> | null>;
  validateSocialUser(createSocialUserRequest: CreateSocialUserRequest): Promise<User | null>;
  login(payload: AccessTokenPayload): Promise<AuthTokenResponse>;
  logout(userId: number): Promise<void>;
  refresh(refreshToken: string): Promise<AuthTokenResponse>;
}
