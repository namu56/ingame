import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Quest, QuestDifficulty, QuestHiddenType, QuestMode } from '@/models/quest.model';
import { createMainQuest } from '@/api/quests.api';

interface SideContent {
  content: string;
}

interface CreateMainQuestProps extends Quest {
  title: string;
  difficulty: QuestDifficulty;
  mode: QuestMode;
  sideQuests: SideContent[];
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
}

export const useCreateQuest = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [isDifficulty, setIsDifficulty] = useState(0);
  const navigate = useNavigate();

  const { register, control, handleSubmit } = useForm<CreateMainQuestProps>();

  const onSubmit = handleSubmit((data) => {
    const hidden = (isPrivate ? 'TRUE' : 'FALSE') as QuestHiddenType;
    const difficulty = isDifficulty === 0 ? 'EASY' : isDifficulty === 1 ? 'NORMAL' : 'HARD' as QuestDifficulty;
    const mode = 'MAIN' as QuestMode;
    const newData = {...data, hidden, difficulty: difficulty, mode: mode};
    CreateQuestMutation.mutate(newData);
  });

  const CreateQuestMutation = useMutation({
    mutationFn: createMainQuest,
    onSuccess(res) {
      // navigate('/');
    },
    onError(err) {
      // navigate('/error');
    },
  });

  return {
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    register,
    control,
    handleSubmit,
    onSubmit,
    CreateQuestMutation,
    navigate
  };
};