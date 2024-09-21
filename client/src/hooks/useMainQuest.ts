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
  const [plusQuest, setPlusQuest] = useState(1);
  const [minusQuest, setMinusQuest] = useState(0);
  const today = formattedDate(new Date());
  const navigate = useNavigate();
  const { register, control, handleSubmit } = useForm<CreateMainQuestProps>();

  const onSubmit = handleSubmit((data) => {
    if (data.sideQuests && data.sideQuests.length > 0) {
      const hidden = (isPrivate ? 'TRUE' : 'FALSE') as QuestHiddenType;
      const difficulty =
        isDifficulty === 0 ? 'EASY' : isDifficulty === 1 ? 'NORMAL' : ('HARD' as QuestDifficulty);
      const mode = 'MAIN' as QuestMode;
      const newData = { ...data, hidden, difficulty: difficulty, mode: mode };
      createMainQuestMutation.mutate(newData);
    } else {
      alert('사이드 퀘스트를 추가해주세요.');
    }
  });

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
    register,
    control,
    handleSubmit: onSubmit,
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    plusQuest,
    setPlusQuest,
    minusQuest,
    setMinusQuest,
    today,
  };
};

export const useEditMainQuestForm = (content: MainQuest, date: string) => {
  const [startDate, setStartDate] = useState(content.startDate);
  const [endDate, setEndDate] = useState(content.endDate);
  const [title, setTitle] = useState(content.title);
  const [isDifficulty, setIsDifficulty] = useState(content.difficulty);
  const [sideQuests, setSideQuests] = useState<(SideContent & { isNew?: boolean })[]>(
    content.sideQuests.map((sideQuest) => ({ ...sideQuest, isNew: false }))
  );
  const [isPrivate, setIsPrivate] = useState(content.hidden === 'TRUE');
  const [deletedSideQuests, setDeletedSideQuests] = useState<number[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const MAX_SIDE_QUESTS = 5;
  const { register, control, handleSubmit } = useForm<MainQuest>();

  const editQuestMutation = useMutation({
    mutationFn: (variable: MainQuest) => {
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

  const addSideQuest = () => {
    if (sideQuests.length < MAX_SIDE_QUESTS) {
      setSideQuests([...sideQuests, { content: '', isNew: true }]);
    }
  };

  const removeSideQuest = (index: number) => {
    if (sideQuests[index].isNew) {
      setSideQuests(sideQuests.filter((_, i) => i !== index));
    } else {
      toggleSideQuestDeletion(index);
    }
  };

  const toggleSideQuestDeletion = (index: number) => {
    if (!sideQuests[index].isNew) {
      setDeletedSideQuests((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  const updateSideQuest = (index: number, newContent: string) => {
    setSideQuests((prevSideQuests) => {
      const updatedSideQuests = [...prevSideQuests];
      updatedSideQuests[index] = { ...updatedSideQuests[index], content: newContent };
      return updatedSideQuests;
    });
  };

  const onSubmit = handleSubmit((data) => {
    const hidden: QuestHiddenType = isPrivate ? 'TRUE' : 'FALSE';
    const updatedSideQuests: SideContent[] = sideQuests
      .filter((_, index) => !deletedSideQuests.includes(index))
      .map(({ isNew, ...sideQuest }) => ({
        ...sideQuest,
        content: sideQuest.content,
        id: sideQuest.id,
      }));
    const { id, ...rest } = data;
    const newData = { id, ...rest, hidden, sideQuests: updatedSideQuests };

    editQuestMutation.mutate(newData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [...QUEST.GET_MAINQUEST, date],
        });
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
    addSideQuest,
    removeSideQuest,
    updateSideQuest,
    deletedSideQuests,
    toggleSideQuestDeletion,
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
