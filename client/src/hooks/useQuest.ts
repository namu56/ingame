import { getSubQuest, modiSubQuest } from '@/api/quests.api';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { QUERYSTRING } from '@/constant/queryString';
import { QuestStatus } from '@/models/quest.model';
import { formattedCalendar } from '@/utils/formatter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

export const useQuest = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const queryClient = useQueryClient();

  const { data: subQuestList, isLoading } = useQuery({
    queryKey: ['getSubQuest', params.get(QUERYSTRING.DATE)],
    queryFn: () =>
      getSubQuest({
        date: params.get(QUERYSTRING.DATE) || formattedCalendar(new Date()),
      }),
  });

  const modifySubQuest = async (data: SubQuestModifyProps) => {
    modifySubQuestMutation.mutate(data);
  };

  const modifySubQuestMutation = useMutation({
    mutationFn: modiSubQuest,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['getSubQuest', params.get(QUERYSTRING.DATE)] });
    },
    onError(err) {},
  });

  interface ModifySubQuestStatusProps {
    id: number;
    status: QuestStatus;
  }

  const modifySubQuestStatus = (data: ModifySubQuestStatusProps) => {};

  const date = params.get(QUERYSTRING.DATE) || formattedCalendar(new Date());

  return {
    quest: subQuestList,
    isLoading,
    modifySubQuest,
    modifySubQuestStatus,
    date,
  };
};
