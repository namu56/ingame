import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ExceptionResponse } from '@common/responses/exception/exception.response';
import { getAsiaTime } from '@common/utils/date.util';
import { ValidationException } from '@core/exceptions/validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode = this.getHttpStatus(exception);
    const timestamp = getAsiaTime();
    const message = this.getErrorMessage(exception);
    const detail = this.getDetail(exception);
    const stack = this.getStack(exception);
    const args = req.body;

    const exceptionResponse = new ExceptionResponse(
      statusCode,
      timestamp,
      req.url,
      req.method,
      message
    );

    this.exceptionLogging(exceptionResponse, detail, args, stack);

    res.status(statusCode).json(exceptionResponse);
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
    return exception instanceof Error ? exception.message : 'UNKNOWN ERROR';
  }

  private getDetail(exception: unknown): string | Array<object> | object {
    let detail: string | Array<object> | object = '';

    if (exception instanceof ValidationException) {
      detail = exception.errors.map((error) => ({
        [error.property]: error.constraints,
      }));
    }

    return detail;
  }

  private getStack(exception: unknown): string | undefined {
    return exception instanceof Error ? exception.stack : undefined;
  }

  private exceptionLogging(
    exceptionResponse: ExceptionResponse,
    detail: string | Array<object> | object,
    args?: object,
    stack?: string
  ): void {
    if (exceptionResponse.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({ ...exceptionResponse, detail, args, stack });
    } else {
      this.logger.warn({ ...exceptionResponse, detail, stack });
    }
  }
}
