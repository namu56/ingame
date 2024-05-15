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

export interface SideContent {
  content: string;
  status: number;
  action: string;
}

export interface modiMainQuest {
  id: number;
  title: string;
  difficulty: number;
  side: SideContent[];
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

export type QuestStatus = 'COMPLETED' | 'FAIL' | 'ON_PROGRESS';
export type QuestHiddenType = 'TRUE' | 'FALSE';
export type QuestMode = 'MAIN' | 'SUB';
