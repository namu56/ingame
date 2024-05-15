import { addSubQuest, getSubQuest, modiSubQuest, modiSubQuestStatus } from '@/api/quests.api';
import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { QUEST } from '@/constant/queryKey';
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
    queryKey: [...QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
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
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  interface ModifySubQuestStatusProps {
    id: number;
    status: QuestStatus;
  }

  const modifySubQuestStatus = (data: ModifySubQuestStatusProps) => {};

  const modifySubQuestStatusMutation = useMutation({
    mutationFn: modiSubQuestStatus,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  const createSubQuest = async (data: CreateSubQuestProps) => {
    createSubQuestMutation.mutate(data);
  };

  const createSubQuestMutation = useMutation({
    mutationFn: addSubQuest,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  const date = params.get(QUERYSTRING.DATE) || formattedCalendar(new Date());

  return {
    quest: subQuestList,
    isLoading,
    modifySubQuest,
    modifySubQuestStatus,
    date,
    createSubQuest,
  };
};
