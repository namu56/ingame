import { getAsiaTime } from '@common/utils/date.util';
import { Inject, Injectable, Logger, LoggerService, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private logger: LoggerService,
    private readonly jwtService: JwtService
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const datetime = getAsiaTime();
    const token = this.extractTokenFromHeader(headers);
    const payload = token ? this.jwtService.decode(token) : null;
    const userId = payload ? payload.id : 0;

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${datetime} USER-${userId} ${method} ${originalUrl} ${statusCode} ${ip}`);
    });

    next();
  }

  private extractTokenFromHeader(headers: IncomingHttpHeaders): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
