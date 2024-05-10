export interface Quest {
  id: number;
  userId: number;
  title: string;
  difficulty: number;
  mode: number;
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubQuest {
  id: number;
  title: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
}

export type QuestStatus = 'completed' | 'fail' | 'on_progress';
export type QuestHiddenType = 'TRUE' | 'FALSE';
