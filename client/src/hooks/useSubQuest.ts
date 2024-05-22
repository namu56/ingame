import {
  ModifyQuestStatusProps,
  addSubQuest,
  delSubQuest,
  getSubQuest,
  modiQuestStatus,
  modiSubQuest,
} from '@/api/quests.api';
import { CreateSubQuestProps } from '@/components/modals/CreateSubQuestModal';
import { SubQuestModifyProps } from '@/components/modals/SubQuestModal';
import { QUEST } from '@/constant/queryKey';
import { QUERYSTRING } from '@/constant/queryString';
import { formattedDate } from '@/utils/formatter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { useMessage } from './useMessage';

export const useSubQuest = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const { showConfirm } = useMessage();

  const queryClient = useQueryClient();

  const { data: subQuestList, isLoading: isSubLoading } = useQuery({
    queryKey: [QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
    queryFn: () =>
      getSubQuest({
        date: params.get(QUERYSTRING.DATE) || formattedDate(new Date()),
      }),
  });

  const modifySubQuest = async (data: SubQuestModifyProps) => {
    modifySubQuestMutation.mutate(data);
  };

  const modifySubQuestMutation = useMutation({
    mutationFn: modiSubQuest,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  const modifySubQuestStatus = (data: ModifyQuestStatusProps) => {
    modifyQuestStatusMutation.mutate(data);
  };

  const modifyQuestStatusMutation = useMutation({
    mutationFn: modiQuestStatus,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
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
        queryKey: [QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  const deleteSubQuest = async (id: number) => {
    showConfirm('서브 퀘스트를 삭제하시겠습니까?', () => {
      deleteSubQuestMutation.mutate(id);
    });
  };

  const deleteSubQuestMutation = useMutation({
    mutationFn: delSubQuest,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [QUEST.GET_SUBQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
  });

  const date = params.get(QUERYSTRING.DATE) || formattedDate(new Date());

  return {
    quest: subQuestList,
    isSubLoading,
    modifySubQuest,
    modifySubQuestStatus,
    deleteSubQuest,
    date,
    createSubQuest,
  };
};
