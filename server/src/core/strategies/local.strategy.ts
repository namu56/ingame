import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AccessTokenPayload } from 'src/common/dto/token';
import { AUTH_SERVICE_KEY, IAuthService } from 'src/modules/auth/interfaces/auth-service.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AUTH_SERVICE_KEY) private readonly authService: IAuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<AccessTokenPayload> {
    const user = await this.authService.validateLocalUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = new AccessTokenPayload(user.id, user.email);
    return payload;
  }
}
