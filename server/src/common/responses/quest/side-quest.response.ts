import { Status } from '@common/types/quest/quest.type';
import { Expose } from 'class-transformer';

export class SideQuestResponse {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  status: Status;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
