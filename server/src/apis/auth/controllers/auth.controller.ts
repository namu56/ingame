import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AccessTokenPayload } from '../auth.interface';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공 시 토큰 반환' })
  @ApiNotFoundResponse({ description: 'fail- User not found' })
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: AccessTokenPayload, @Res() res: Response) {
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

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ description: '로그아웃 성공 시 쿠키의 토큰 삭제' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'fail - Invaild token' })
  async logout(@CurrentUser() user: AccessTokenPayload, @Res() res: Response) {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken');
    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
    }
    const { newAccessToken, newRefreshToken } = await this.authService.refresh(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
    });
    res.json(newAccessToken);
  }
}
