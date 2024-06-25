import { IGenericRepository } from 'src/core/database/generic/generic.repository';
import { UserInfo } from './user-info.entity';
import { UserInfoWithRankDto } from 'src/common/dto/ranking/user-info-with-rank.dto';

export const USER_INFO_REPOSITORY_KEY = 'USER_INFO_REPOSITORY_KEY';

export interface IUserInfoRepository extends IGenericRepository<UserInfo> {
  findByUserId(userId: number): Promise<UserInfo | null>;
  findByNickname(nickname: string): Promise<UserInfo | null>;
  getRankings(offset: number, limit: number): Promise<UserInfoWithRankDto[]>;
  getTotalCount(): Promise<number>;
}
