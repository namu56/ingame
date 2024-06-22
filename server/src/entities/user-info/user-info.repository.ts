import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { UserInfo } from './user-info.entity';
import { IUserInfoRepository } from './user-info-repository.interface';
import { EntityTarget } from 'typeorm';
import { UserInfoWithRankDto } from 'src/common/dto/ranking/user-info-with-rank.dto';

export class UserInfoRepository
  extends GenericTypeOrmRepository<UserInfo>
  implements IUserInfoRepository
{
  getName(): EntityTarget<UserInfo> {
    return UserInfo.name;
  }
  async getRankings(offset: number, limit: number): Promise<UserInfoWithRankDto[]> {
    return this.getRepository()
      .createQueryBuilder('userInfo')
      .select('userInfo.id', 'id')
      .addSelect('userInfo.nickname', 'nickname')
      .addSelect('SELECT COUNT(*) + 1 FROM user_info ui WHERE ui.point > userInfo.point', 'rank')
      .orderBy('userInfo.point', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();
  }
  async getTotalCount(): Promise<number> {
    return this.getRepository().count();
  }
}
