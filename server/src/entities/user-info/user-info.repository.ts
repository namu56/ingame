import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { UserInfo } from './user-info.entity';
import { IUserInfoRepository } from './user-info-repository.interface';
import { EntityTarget } from 'typeorm';
import { UserInfoWithRankDto } from '@common/dto/user-info';
import { plainToInstance } from 'class-transformer';

export class UserInfoRepository
  extends GenericTypeOrmRepository<UserInfo>
  implements IUserInfoRepository
{
  getName(): EntityTarget<UserInfo> {
    return UserInfo.name;
  }

  async findByUserId(userId: number): Promise<UserInfo | null> {
    return await this.getRepository()
      .createQueryBuilder('userInfo')
      .where('userInfo.user_id = :userId', { userId })
      .getOne();
  }

  async findByNickname(nickname: string): Promise<UserInfo | null> {
    return this.getRepository().findOneBy({ nickname });
  }

  async getRanking(offset: number, limit: number): Promise<UserInfoWithRankDto[]> {
    const rawResults = await this.getRepository()
      .createQueryBuilder('userInfo')
      .select('userInfo.id', 'id')
      .addSelect('userInfo.nickname', 'nickname')
      .addSelect('userInfo.point', 'point')
      .addSelect((subQuery) => {
        return subQuery
          .select('COUNT(*) + 1')
          .from('user_info', 'ui')
          .where('ui.point > userInfo.point');
      }, 'rank')
      .orderBy('userInfo.point', 'DESC')
      .offset(offset)
      .limit(limit)
      .getRawMany();

    return plainToInstance(UserInfoWithRankDto, rawResults);
  }

  async getTotalCount(): Promise<number> {
    return this.getRepository().count();
  }
}
