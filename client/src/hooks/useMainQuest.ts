import {
  ModifyQuestData,
  ModifyQuestStatusProps,
  createMainQuest,
  deleteMainQuest,
  getMainQuest,
  modiMainQuest,
  modiQuestStatus,
  modiSideQuest,
} from '@/api/quests.api';
import { BASE_KEY, QUEST } from '@/constant/queryKey';
import { QUERYSTRING } from '@/constant/queryString';
import {
  Quest,
  QuestDifficulty,
  QuestHiddenType,
  QuestMode,
  QuestStatus,
  SideContent,
} from '@/models/quest.model';
import { formattedDate } from '@/utils/formatter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export interface EditMainQuestQuestProps extends Quest {
  sideQuests: SideContent[];
}

export interface CreateMainQuestProps extends Quest {
  title: string;
  difficulty: QuestDifficulty;
  mode: QuestMode;
  sideQuests: SideContent[];
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
}

export const useMainQuest = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const date = params.get(QUERYSTRING.DATE) || formattedDate(new Date());

  const {
    data: mainQuest,
    isLoading: isMainLoading,
    error,
  } = useQuery({
    queryKey: [BASE_KEY.QUEST, date],
    queryFn: () => getMainQuest({ date }),
  });

  const CreateQuestMutation = useMutation({
    mutationFn: createMainQuest,
    onSuccess(res) {
      navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  const EditQuestMutation = useMutation({
    mutationFn: (variable: ModifyQuestData) => modiMainQuest(variable.id, variable),
    onSuccess(res) {
      navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  const DeleteMainQuestsMutation = useMutation({
    mutationFn: (id: number) => deleteMainQuest(id),
    onSuccess() {
      navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  const modifyMainQuestStatus = (data: ModifyQuestStatusProps) => {
    modifyQuestStatusMutation.mutate(data);
  };

  const modifyQuestStatusMutation = useMutation({
    mutationFn: modiQuestStatus,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_MAINQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  const patchSideMutation = useMutation({
    mutationFn: ({ param, status }: { param: number; status: QuestStatus }) => modiSideQuest(param, status),
    onSuccess(res) {
      
    },
    onError(err) {
      navigate('/error');
    },
});

  return {
    mainQuest,
    isMainLoading,
    CreateQuestMutation,
    EditQuestMutation,
    modifyMainQuestStatus,
    patchSideMutation,
    DeleteMainQuestsMutation,
    date,
  };
};
