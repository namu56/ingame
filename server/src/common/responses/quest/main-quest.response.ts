import { Difficulty, Hidden, Status } from '@common/types/quest/quest.type';
import { Expose, Type } from 'class-transformer';
import { Mode } from 'fs';
import { SideQuestResponse } from './side-quest.response';

export class MainQuestResponse {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  difficulty: Difficulty;

  @Expose()
  mode: Mode;

  @Expose()
  hidden: Hidden;

  @Expose()
  status: Status;

  @Type(() => SideQuestResponse)
  @Expose()
  sideQuests: SideQuestResponse[];

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
