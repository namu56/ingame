import { getMainQuest } from '@/api/quests.api';
import { BASE_KEY } from '@/constant/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useMainQuest = () => {
  const {
    data: mainQuest,
    isLoading: isMainLoading,
    error,
  } = useQuery({
    queryKey: [BASE_KEY.QUEST],
    queryFn: () => getMainQuest(),
  });

  return {
    mainQuest,
    isMainLoading,
  };
};
