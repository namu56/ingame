import { getRanking } from '@/api/ranking.api';
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
    // queryFn: ({ pageParam = 0 }) => getRanking({ pageParam }),
    //   getNextPageParam: (result, pages) => { // result 가 결과값, pages 는 이전까지의 결과값들
    //     if (!result.isLastPage) return result.pageNum;
    //     return null;
    //   },
    // });
  });

  // const {
  //   data,
  //   isLoading,
  //   isError,
  // } = useInfiniteQuery({
  //   queryKey: [...RANK.GET_RANKING],
  //   queryFn: ({ pageParam = 0 }) => getRanking({ pageParam }),
  //     getNextPageParam: (result, pages) => { // result 가 결과값, pages 는 이전까지의 결과값들
  //       if (!result.isLastPage) return result.pageNum;
  //       return null;
  //     },
  //   });
  // });

  return { rankingData };
};
