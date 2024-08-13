import { HttpStatus } from '@nestjs/common';

export class ExceptionResponse {
  readonly statusCode: HttpStatus;
  readonly timestamp: Date;
  readonly path: string;
  readonly method: string;
  readonly message: string;
  readonly detail: string | Array<object> | object;
}
