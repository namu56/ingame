import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({ description: '로그인 성공 시 토큰 반환' })
  @ApiNotFoundResponse({ description: 'fail- User not found' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const acceccToken = await this.authService.login(loginUserDto);

    res.cookie('accessToken', acceccToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json(acceccToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  @ApiBearerAuth('accessToken')
  @ApiOkResponse({ description: '로그아웃 성공 시 쿠키의 토큰 삭제' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated' })
  @ApiForbiddenResponse({ description: 'fail - Invaild token' })
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
