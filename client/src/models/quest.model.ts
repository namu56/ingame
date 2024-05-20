export interface Quest {
  id: number;
  title: string;
  difficulty: QuestDifficulty;
  mode: QuestMode;
  sideQuests: SideContent[];
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SideContent {
  id?: number;
  content?: string;
  status?: QuestStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface modiSideContent {
  content: string;
  status: QuestStatus;
}

export interface modiQuest {
  id: number;
  title: string;
  difficulty: QuestDifficulty;
  hidden: QuestHiddenType;
  sideQuests: modiSideContent[];
  startDate: string;
  endDate: string;
}

export interface SubQuest {
  id: number;
  title: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
}

export type QuestStatus = 'COMPLETED' | 'FAIL' | 'ON_PROGRESS';
export type QuestHiddenType = 'TRUE' | 'FALSE';
export type QuestMode = 'MAIN' | 'SUB';
export type QuestDifficulty = 'DEFAULT' | 'EASY' | 'NORMAL' | 'HARD';
