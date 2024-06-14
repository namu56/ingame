import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const statusCode = this.getHttpStatus(exception);
    const datetime = new Date();
    const message = this.getErrorMessage(exception);

    const errorResponse = {
      statusCode,
      timestamp: datetime,
      path: req.url,
      method: req.method,
      message: message,
    };
    const args = req.body;

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(message, args, JSON.stringify(errorResponse));
    } else {
      this.logger.warn(message, JSON.stringify(errorResponse));
    }

    res.status(statusCode).json(errorResponse);
  }
  private getHttpStatus(exception: unknown): HttpStatus {
    if (exception instanceof QueryFailedError) {
      return HttpStatus.CONFLICT;
    } else if (exception instanceof HttpException) {
      return exception.getStatus();
    } else {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return exception.message;
    } else if (exception instanceof QueryFailedError) {
      return 'Query Failed Error';
    } else if (exception instanceof Error) {
      return exception.message;
    } else {
      return 'UNKNOWN ERROR';
    }
  }
}
