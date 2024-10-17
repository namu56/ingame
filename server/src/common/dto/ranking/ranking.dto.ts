import { Expose } from 'class-transformer';

export class RankingDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly nickname: string;

  @Expose()
  readonly point: number;

  @Expose()
  readonly rank: number;

  @Expose()
  readonly level: number;
}
