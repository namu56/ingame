import { getSubQuest } from '@/api/quests.api';
import { QUERYSTRING } from '@/constant/queryString';
import { formattedCalendar } from '@/utils/formatter';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

export const useQuest = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const {
    data: subQuestList,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['getSubQuest', params.get(QUERYSTRING.DATE)],
    queryFn: () =>
      getSubQuest({
        date: params.get(QUERYSTRING.DATE) || formattedCalendar(new Date()),
      }),
  });

  return {
    quest: subQuestList,
    isLoading,
  };
};
