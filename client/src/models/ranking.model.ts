interface RankingItem {
  id: number;
  nickname: string;
  point: number;
  rank: number;
}

type Ranking = RankingItem[];

export const ranking: Ranking = [];