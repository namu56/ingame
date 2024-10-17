export interface RankingItem {
  id: number;
  nickname: string;
  point: number;
  rank: number;
  level: number;
}

export interface Pagination {
  totalPage: number;
  nextPage: number;
}

export interface RankingResponse {
  rankings: RankingItem[];
  pagination: Pagination;
}
