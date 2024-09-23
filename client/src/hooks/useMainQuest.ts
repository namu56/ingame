import {
  ModifyQuestStatusProps,
  createMainQuest,
  deleteMainQuest,
  getFindOneMainQuest,
  getMainQuest,
  modiMainQuest,
  modiQuestStatus,
} from '@/api/quests.api';
import { QUEST } from '@/constant/queryKey';
import { QUERYSTRING } from '@/constant/queryString';
import {
  MainQuest,
  Quest,
  QuestDifficulty,
  QuestHiddenType,
  QuestMode,
  SideContent,
} from '@/models/quest.model';
import { formattedDate } from '@/utils/formatter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMessage } from '@/hooks/useMessage';
import { MAX_SIDE_QUESTS } from '@/constant/quest';
import { UpdateMainQuestProps, UpdateSideQuestProps } from '@/pages/EditMainQuest';

export interface CreateMainQuestProps {
  title: string;
  difficulty: QuestDifficulty;
  mode: QuestMode;
  sideQuests: SideContent[];
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
}

export const useMainQuest = (questId?: number) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const date = params.get(QUERYSTRING.DATE) || formattedDate(new Date());

  const { data: mainQuests, isLoading: isMainQuestsLoading } = useQuery({
    queryKey: [...QUEST.GET_MAINQUEST, date],
    queryFn: () => getMainQuest({ date }),
  });

  const { data: mainQuest, isLoading: isMainQuestLoading } = useQuery({
    queryKey: [...QUEST.GET_MAINQUEST, questId],
    queryFn: () => getFindOneMainQuest(questId!),
    enabled: !!questId,
  });

  const deleteMainQuestsMutation = useMutation({
    mutationFn: (id: number) => deleteMainQuest(id),
    onSuccess: async (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: [...QUEST.GET_MAINQUEST, deletedId],
        exact: true,
      });
      await queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_MAINQUEST, date],
      });
      navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  const modifyMainQuestStatus = (data: ModifyQuestStatusProps) => {
    return modifyQuestStatusMutation.mutateAsync(data);
  };

  const modifyQuestStatusMutation = useMutation({
    mutationFn: (data: ModifyQuestStatusProps) => modiQuestStatus(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [...QUEST.GET_MAINQUEST, params.get(QUERYSTRING.DATE)],
      });
    },
    onError(err) {},
  });

  return {
    mainQuests,
    isMainQuestsLoading,
    mainQuest,
    isMainQuestLoading,
    modifyMainQuestStatus,
    deleteMainQuestsMutation,
    date,
  };
};

export const useCreateMainQuestForm = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDifficulty, setIsDifficulty] = useState(0);
  const [startDate, setStartDate] = useState(formattedDate(new Date()));
  const [endDate, setEndDate] = useState('');
  const today = formattedDate(new Date());
  const navigate = useNavigate();

  const onSubmit = (data: CreateMainQuestProps) => {
    if (data.sideQuests && data.sideQuests.length > 0) {
      const hidden = (isPrivate ? 'TRUE' : 'FALSE') as QuestHiddenType;
      const difficulty =
        isDifficulty === 0 ? 'EASY' : isDifficulty === 1 ? 'NORMAL' : ('HARD' as QuestDifficulty);
      const mode = 'MAIN' as QuestMode;
      const newData = { ...data, hidden, difficulty, mode };
      createMainQuestMutation.mutate(newData);
    } else {
      alert('사이드 퀘스트를 추가해주세요.');
    }
  };

  const createMainQuestMutation = useMutation({
    mutationFn: createMainQuest,
    onSuccess(res) {
      navigate('/');
    },
    onError(err) {
      navigate('/error');
    },
  });

  return {
    onSubmit,
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    today,
  };
};

export const useEditMainQuestForm = (content: MainQuest, date: string) => {
  const [startDate, setStartDate] = useState(content.startDate);
  const [endDate, setEndDate] = useState(content.endDate);
  const [title, setTitle] = useState(content.title);
  const [isDifficulty, setIsDifficulty] = useState(content.difficulty);
  const [isPrivate, setIsPrivate] = useState(content.hidden === 'TRUE');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const editQuestMutation = useMutation({
    mutationFn: (variable: UpdateMainQuestProps) => {
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

  const onSubmit = (
    data: UpdateMainQuestProps,
    sideQuests: UpdateSideQuestProps[],
    date: string
  ) => {
    const hidden: QuestHiddenType = isPrivate ? 'TRUE' : 'FALSE';
    const updatedSideQuests = sideQuests.map((sideQuest) => ({
      ...sideQuest,
      content: sideQuest.content,
      id: sideQuest.id,
    }));
    const newData: UpdateMainQuestProps = { ...data, hidden, sideQuests: updatedSideQuests };

    editQuestMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [...QUEST.GET_MAINQUEST, date],
        });
        navigate('/', { state: { updatedData: newData } });
      },
    });
  };

  return {
    onSubmit,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    title,
    setTitle,
    isDifficulty,
    setIsDifficulty,
    isPrivate,
    setIsPrivate,
  };
};

export const useConfirmDelete = (content: Quest) => {
  const { showConfirm } = useMessage();
  const { deleteMainQuestsMutation } = useMainQuest();

  const handleDeleteBtn = () => {
    const message = '정말 삭제하시겠습니까?';
    showConfirm(message, () => {
      if (content && content.id !== undefined) {
        deleteMainQuestsMutation.mutateAsync(content.id);
      }
    });
  };

  return { handleDeleteBtn };
};
