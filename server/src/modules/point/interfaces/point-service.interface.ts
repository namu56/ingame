import { UpdatePointRequest } from '@common/requests/point';
import { Status } from '@common/types/quest/quest.type';
import { Quest } from '@entities/quest/quest.entity';

export const POINT_SERVICE_KEY = 'pointServiceKey';

export interface IPointService {
  updatePointForQuest(userId: number, updatePointRequest: UpdatePointRequest): Promise<void>;
  updatePointForExpiredQuest(quest: Quest, status: Status): Promise<void>;
}
