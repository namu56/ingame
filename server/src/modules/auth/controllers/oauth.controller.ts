import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GoogleAuthGuard } from '../../../core/guards/google-auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { AuthTokenInterceptor } from 'src/core/interceptors/auth-token.interceptor';
import { AUTH_SERVICE_KEY, IAuthService } from 'src/modules/auth/interfaces/auth-service.interface';
import { AuthTokenResponse } from '@common/responses/token';
import { AccessTokenPayload } from '@common/dto/token';

@Controller('oauth')
export class OAuthController {
  constructor(@Inject(AUTH_SERVICE_KEY) private readonly authService: IAuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async googleLoginCallBack(@CurrentUser() user: AccessTokenPayload): Promise<AuthTokenResponse> {
    return await this.authService.login(user);
  }
}
