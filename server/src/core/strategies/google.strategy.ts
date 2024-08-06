import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { IUserService, USER_SERVICE_KEY } from 'src/modules/user/interfaces/user-service.interface';
import { CreateSocialUserRequest } from 'src/common/requests/user';
import { AccessTokenPayload } from 'src/common/dto/token';
import { AUTH_SERVICE_KEY, IAuthService } from 'src/modules/auth/interfaces/auth-service.interface';
import { UserProvider } from 'src/common/types/user/user.type';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_SERVICE_KEY) private readonly userService: IUserService,
    @Inject(AUTH_SERVICE_KEY) private readonly authService: IAuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'select_account',
    };
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    const { emails, id, displayName } = profile;
    const googleUser = new CreateSocialUserRequest(
      emails[0].value,
      UserProvider.GOOGLE,
      id,
      displayName
    );

    try {
      let user = await this.authService.validateSocialUser(googleUser);
      user = user ? user : await this.userService.socialSignUp(googleUser);
      const payload = new AccessTokenPayload(user.id, user.email);

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Google 계정을 통한 인증에 실패했습니다.');
    }
  }
}
