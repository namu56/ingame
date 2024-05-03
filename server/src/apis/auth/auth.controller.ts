import { Controller, Post, Body, HttpStatus, HttpCode, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const acceccToken = await this.authService.login(loginUserDto);

    res.cookie('accessToken', acceccToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.json({ message: 'success' });
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('accessToken');
    res.sendStatus(HttpStatus.NO_CONTENT);
  }
}
