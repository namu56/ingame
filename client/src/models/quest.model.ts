export interface Quest {
  id: number;
  userId: number;
  title: string;
  difficulty: number;
  mode: number;
  startDate: string;
  endDate: string;
  hidden: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubQuest {
  id: number;
  title: string;
  hidden: number;
  status: QuestStatus;
}

export type QuestStatus = 'completed' | 'fail' | 'on_progress';
