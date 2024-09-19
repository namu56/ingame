export interface Quest {
  id: number;
  title: string;
  difficulty: QuestDifficulty;
  mode: QuestMode;
  startDate: string;
  endDate: string;
  hidden: QuestHiddenType;
  status: QuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MainQuest extends Quest {
  sideQuests: SideContent[];
}

export interface SideContent {
  id?: number;
  content?: string;
  status?: QuestStatus;
  createdAt?: string;
  updatedAt?: string;
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
