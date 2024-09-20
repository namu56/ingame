import { modiSideQuest } from '@/api/quests.api';
import { QUEST } from '@/constant/queryKey';
import { MainQuest, QuestStatus } from '@/models/quest.model';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useMessage } from './useMessage';

export const useSideQuest = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useMessage();

  const patchSideMutation = useMutation({
    mutationFn: ({
      questId,
      sideQuestId,
      status,
    }: {
      questId: number;
      sideQuestId: number;
      status: QuestStatus;
    }) => modiSideQuest(questId, sideQuestId, status),
    onSuccess: (_, { questId, sideQuestId, status }) => {
      queryClient.setQueryData(
        [...QUEST.GET_MAINQUEST, questId],
        (oldData: MainQuest | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            sideQuests: oldData.sideQuests.map((sideQuest) =>
              sideQuest.id === sideQuestId ? { ...sideQuest, status } : sideQuest
            ),
          };
        }
      );
    },
    onError(err) {
      navigate('/error');
      showAlert('퀘스트 상태 변경에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return {
    patchSideMutation,
  };
};
