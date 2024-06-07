import { Controller, Get, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { Response } from 'express';
import { AuthService } from '../auth.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AccessTokenPayload } from '../auth.interface';

@Controller('oauth')
export class OAuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @HttpCode(HttpStatus.OK)
  async googleLoginCallBack(@CurrentUser() user: AccessTokenPayload, @Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    const { accessToken, refreshToken } = await this.authService.login(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    });
    res.json({ accessToken });
  }
}
