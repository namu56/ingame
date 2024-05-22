import { IsNumber } from 'class-validator';

export class PaginationRequestDto {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}
