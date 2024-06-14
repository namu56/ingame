import { Controller, Get, HttpCode, HttpStatus, UseGuards, UseInterceptors } from '@nestjs/common';
import { GoogleAuthGuard } from '../../../core/guards/google-auth.guard';
import { AuthService } from '../auth.service';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { AccessTokenPayload, AuthTokens } from '../auth.interface';
import { AuthTokenInterceptor } from 'src/core/interceptors/auth-token.interceptor';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async googleLoginCallBack(@CurrentUser() user: AccessTokenPayload): Promise<AuthTokens> {
    return await this.authService.login(user);
  }
}
