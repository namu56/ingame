import { Controller, Get, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { Request, Response } from 'express';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';

@Controller('oauth')
export class OAuthController {
  @Get('google')
  @UseInterceptors(TransactionInterceptor)
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
