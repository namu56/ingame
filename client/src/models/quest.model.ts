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