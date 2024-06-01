import {
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '@/hooks/useMessage';

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
    mutationFn: (variable: Quest) => {
      const { id, ...rest } = variable;
      return modiMainQuest(id, rest);
    },
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

export const useEditMainQuestForm = (content: Quest, date: string) => {
  const [startDate, setStartDate] = useState(content.startDate);
  const [endDate, setEndDate] = useState(content.endDate);
  const [title, setTitle] = useState(content.title);
  const [isDifficulty, setIsDifficulty] = useState(content.difficulty);
  const [sideQuests, setSideQuests] = useState<SideContent[]>(content.sideQuests);
  const [isPrivate, setIsPrivate] = useState(content.hidden === 'TRUE');
  
  const { EditQuestMutation } = useMainQuest();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit } = useForm<EditMainQuestQuestProps>();

  const onSubmit = handleSubmit((data) => {
    const hidden: QuestHiddenType = isPrivate ? 'TRUE' : 'FALSE';
    const updatedSideQuests = (sideQuests || []).map((sideQuest) => ({
      ...sideQuest,
      status: sideQuest.status,
    }));
    const { id, ...rest } = data;
    const newData = { id, ...rest, hidden, sideQuests: updatedSideQuests };

    EditQuestMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.setQueryData([BASE_KEY.QUEST, content.id], (oldData: Quest | undefined) => ({
          ...oldData,
          ...newData,
        }));
        queryClient.invalidateQueries({ queryKey: [BASE_KEY.QUEST, date], exact: true });
        navigate('/', { state: { updatedData: newData } });
      },
    });
  });

  return {
    register,
    control,
    handleSubmit: onSubmit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    isDifficulty,
    setIsDifficulty,
    sideQuests,
    setSideQuests,
    isPrivate,
    setIsPrivate,
  };
};

export const useConfirmDelete = (content: Quest) => {
  const { showConfirm } = useMessage();
  const { DeleteMainQuestsMutation } = useMainQuest();

  const handleDeleteBtn = () => {
    const message = '정말 삭제하시겠습니까?';
    showConfirm(message, () => {
      if (content && content.id !== undefined) {
        DeleteMainQuestsMutation.mutate(content.id);
      }
    });
  };

  return { handleDeleteBtn };
};