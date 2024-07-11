import { UpdatePointRequest } from '@common/requests/point';

export const POINT_SERVICE_KEY = 'pointServiceKey';

export interface IPointService {
  updatePoint(userId: number, updatePointRequest: UpdatePointRequest): Promise<void>;
}
