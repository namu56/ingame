import {
  Controller,
  Post,
  HttpStatus,
  HttpCode,
  Res,
  Req,
  UseGuards,
  HttpException,
  UseInterceptors,
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
import { AccessTokenPayload, AuthTokens } from '../auth.interface';
import { AuthTokenInterceptor } from 'src/common/interceptors/auth-token.interceptor';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공 시 토큰 반환' })
  @ApiNotFoundResponse({ description: 'fail- User not found' })
  async login(@CurrentUser() user: AccessTokenPayload): Promise<AuthTokens> {
    return await this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
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
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<AuthTokens> {
    const refreshToken: string = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
    }
    return await this.authService.refresh(refreshToken);
  }
}
