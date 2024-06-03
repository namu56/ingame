import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { Request, Response } from 'express';

@Controller('oauth')
export class OAuthController {
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin(): Promise<void> {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallBack(@Req() req: Request, @Res() res: Response) {
    const { user } = req;
    console.log('user:', user);
    return res.send(user);
  }
}
