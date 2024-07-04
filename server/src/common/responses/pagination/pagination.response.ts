export class PaginationResponse {
  constructor(
    readonly totalPage: number,
    readonly nextPage: number
  ) {}
}
