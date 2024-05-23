import { RankingResponse, getRanking } from '@/api/ranking.api';
import { RANK } from '@/constant/queryKey';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useRank = () => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<RankingResponse, unknown>({
    queryKey: RANK.GET_RANKING,
    queryFn: ({ pageParam = 1 }) => getRanking({ totalPage: Number(pageParam) }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.nextPage !== null) return lastPage.pagination.nextPage;
      return undefined;
    },
    initialPageParam: 1,
  });
  
  const rankingData = data ? data.pages.flatMap((page) => page) : [];

  return { rankingData, isLoading, isError, fetchNextPage, hasNextPage };
};
