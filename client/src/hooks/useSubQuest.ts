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
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from './useMessage';

export const useSubQuest = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { showConfirm } = useMessage();
  const queryClient = useQueryClient();
  const date = params.get(QUERYSTRING.DATE) || formattedDate(new Date());
  const navigate = useNavigate();

  const { data: subQuests, isLoading: isSubLoading } = useQuery({
    queryKey: [...QUEST.GET_SUBQUEST, date],
    queryFn: () => getSubQuest({ date }),
  });

  const modifySubQuest = async (data: SubQuestModifyProps) => {
    modifySubQuestMutation.mutate(data);
  };

  const modifySubQuestMutation = useMutation({
    mutationFn: (data: SubQuestModifyProps) => modiSubQuest(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, date],
      });
    },
    onError(err) {},
  });

  const modifySubQuestStatus = (data: ModifyQuestStatusProps) => {
    return modifyQuestStatusMutation.mutateAsync(data);
  };

  const modifyQuestStatusMutation = useMutation({
    mutationFn: (data: ModifyQuestStatusProps) => modiQuestStatus(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, date],
      });
    },
    onError(err) {},
  });

  const createSubQuest = async (data: CreateSubQuestProps) => {
    createSubQuestMutation.mutate(data);
  };

  const createSubQuestMutation = useMutation({
    mutationFn: (data: CreateSubQuestProps) => addSubQuest(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, date],
      });
    },
    onError(err) {
      navigate('/error');
    },
  });

  const deleteSubQuest = async (id: number) => {
    showConfirm('서브 퀘스트를 삭제하시겠습니까?', () => {
      deleteSubQuestMutation.mutate(id);
    });
  };

  const deleteSubQuestMutation = useMutation({
    mutationFn: (id: number) => delSubQuest(id),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_SUBQUEST, date],
      });
    },
  });

  return {
    subQuests,
    isSubLoading,
    modifySubQuest,
    modifySubQuestStatus,
    deleteSubQuest,
    date,
    createSubQuest,
  };
};
