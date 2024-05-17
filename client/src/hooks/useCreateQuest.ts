import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Quest, QuestHiddenType } from '@/models/quest.model';
import { createMainQuest } from '@/api/quests.api';

interface SideContent {
  content: string;
}

interface CreateMainQuestProps extends Quest {
  title: string;
  difficulty: number;
  side: SideContent[];
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
    const newData = {...data, hidden, difficulty: isDifficulty};
    CreateQuestMutation.mutate(newData);
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

  return {
    isPrivate,
    setIsPrivate,
    isDifficulty,
    setIsDifficulty,
    register,
    control,
    handleSubmit,
    onSubmit,
    CreateQuestMutation
  };
};