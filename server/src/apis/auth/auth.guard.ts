import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const acceccToken = this.extractTokenFromHeader(request);
    if (!acceccToken) {
      throw new UnauthorizedException();
    }
    try {
      const secretKey = this.configService.get<string>('SECRET_KEY');
      const payload: JwtPayloadDto = await this.jwtService.verifyAsync(acceccToken, {
        secret: secretKey,
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, acceccToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? acceccToken : undefined;
  }
}
