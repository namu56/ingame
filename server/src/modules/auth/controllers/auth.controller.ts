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
  Inject,
} from '@nestjs/common';
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
import { LocalAuthGuard } from '../../../core/guards/local-auth.guard';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { AuthTokenInterceptor } from 'src/core/interceptors/auth-token.interceptor';
import { AccessTokenPayload } from 'src/common/dto/token';
import { AuthTokenResponse } from 'src/common/responses/token';
import { AUTH_SERVICE_KEY, IAuthService } from 'src/modules/auth/interfaces/auth-service.interface';
import { CurrentUser } from '@core/decorators/current-user.decorator';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE_KEY) private readonly authService: IAuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공 시 토큰 반환' })
  @ApiNotFoundResponse({ description: 'fail- User not found' })
  async login(@CurrentUser() user: AccessTokenPayload): Promise<AuthTokenResponse> {
    return await this.authService.login(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ description: '로그아웃 성공 시 쿠키의 토큰 삭제' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'fail - Invaild token' })
  async logout(@CurrentUser() user: AccessTokenPayload, @Res() res: Response): Promise<void> {
    await this.authService.logout(user.id);
    res.clearCookie('refreshToken');
    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('token')
  @UseInterceptors(AuthTokenInterceptor)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<AuthTokenResponse> {
    const refreshToken: string = req.cookies.refreshToken;
    console.log(refreshToken);
    if (!refreshToken) {
      throw new HttpException('Refresh token not found', HttpStatus.UNAUTHORIZED);
    }
    return await this.authService.refresh(refreshToken);
  }
}
