import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { ExceptionResponse } from '@common/responses/exception/exception.response';
import { getAsiaTime } from '@common/utils/date.util';
import { ValidationException } from '@core/exceptions/validation.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const statusCode = this.getHttpStatus(exception);
    const timestamp = getAsiaTime();
    const message = this.getMessage(exception);
    const detail = this.getDetail(exception);

    let exceptionResponse: ExceptionResponse = {
      statusCode,
      timestamp,
      path: req.url,
      method: req.method,
      message: message,
      detail,
    };

    const args = req.body;

    this.exceptionLogging(exceptionResponse, args);

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

  private getMessage(exception: unknown): string {
    return exception instanceof Error ? exception.message : 'UNKNOWN ERROR';
  }

  private getDetail(exception: unknown): string | Array<object> | object {
    let detail: string | Array<object> | object = '';
    if (exception instanceof HttpException) {
      detail = exception.getResponse;
    }

    if (exception instanceof QueryFailedError) {
      detail = { query: exception.query, parameters: exception.parameters };
    }

    if (exception instanceof ValidationException) {
      detail = exception.errors.map((error) => ({
        [error.property]: error.constraints,
      }));
    }

    return detail;
  }

  private exceptionLogging(exceptionResponse: ExceptionResponse, args?: object): void {
    if (exceptionResponse.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(exceptionResponse.message, JSON.stringify(exceptionResponse));
    } else {
      this.logger.warn(exceptionResponse.message, JSON.stringify(exceptionResponse));
    }
  }
}
