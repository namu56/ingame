export interface Quest {
  id: number;
  userId: number;
  title: string;
  difficulty: number;
  mode: QuestMode;
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface getSideQuest {
  id: number;
  content: string;
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface getQuest {
  id: number;
  title: string;
  difficulty: number;
  mode: QuestMode;
  sideQuests: getSideQuest[];
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
  createdAt: string;
}

export interface SideContent {
  content: string;
  status: QuestStatus;
  action: string;
}

export interface modiMainQuest {
  id: number;
  title: string;
  difficulty: number;
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
}

export interface SubQuest {
  id: number;
  title: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
}

export type QuestStatus = 'completed' | 'fail' | 'on_progress';
export type QuestHiddenType = 'TRUE' | 'FALSE';
export type QuestMode = 'MAIN' | 'SUB';
