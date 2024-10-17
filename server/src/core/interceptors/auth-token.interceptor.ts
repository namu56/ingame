import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        if (data && data.refreshToken) {
          const isProduction = process.env.NODE_ENV === 'production';

          res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: isProduction ? 'none' : 'lax',
            secure: isProduction,
          });

          delete data.refreshToken;
        }
        return { accessToken: data.accessToken };
      })
    );
  }
}
