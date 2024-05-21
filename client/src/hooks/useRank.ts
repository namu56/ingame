import { getRanking } from '@/api/ranking.api';
// import { getRanking } from '@/mocks/handlers/ranking'; 
import { RANK } from '@/constant/queryKey';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

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

  // const {
  //   data,
  //   isLoading,
  //   isError,
  //   fetchNextPage,
  //   hasNextPage,
  // } = useInfiniteQuery({
  //   queryKey: [...RANK.GET_RANKING],
  //   queryFn: ({ pageParam = 0 }) => getRanking({ pageParam, rankingPerPage: 10 }),
  //   getNextPageParam: (lastPage) => {
  //     if (!lastPage.isLastPage) return lastPage.pageNum;
  //     return null;
  //   },
  // });

  // return { rankingData: data, isLoading, isError, fetchNextPage, hasNextPage };
};
