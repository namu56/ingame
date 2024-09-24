import { Expose } from 'class-transformer';

export class PaginationResponse {
  @Expose()
  readonly totalPage: number;

  @Expose()
  readonly nextPage: number;
}
