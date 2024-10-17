import { HttpStatus } from '@nestjs/common';

export class ExceptionResponse {
  constructor(
    readonly statusCode: HttpStatus,
    readonly timestamp: Date,
    readonly path: string,
    readonly method: string,
    readonly message: string
  ) {}
}
