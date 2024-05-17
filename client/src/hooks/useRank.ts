import { getRanking } from '@/api/ranking.api';
import { RANK } from '@/constant/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useRank = () => {
  const {
    data: rankingData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [...RANK.GET_RANKING],
    queryFn: () => getRanking(),
  });

  return { rankingData };
};
