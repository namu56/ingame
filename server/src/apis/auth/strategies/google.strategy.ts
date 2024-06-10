import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { CreateSnsUserDto } from 'src/apis/users/dto/create-sns-user.dto';
import { UsersService } from 'src/apis/users/users.service';
import { AuthService } from '../auth.service';
import { AccessTokenPayload } from '../auth.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
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
    const googleUser: CreateSnsUserDto = {
      email: profile.emails[0].value,
      provider: profile.provider,
      providerId: profile.id,
      nickname: profile.displayName,
    };
    try {
      let user = await this.authService.validateSnsUser(googleUser);
      user = user ? user : await this.usersService.socialSignUp(googleUser);
      const payload: AccessTokenPayload = { id: user.id, email: user.email };
      console.log(payload);

      return payload;
    } catch (err) {
      throw err;
    }
  }
}
