import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../quests/entities/quest.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdatePointDto } from './dto/update-point.dto';
import { Difficulty, Mode, Status } from '../quests/enums/quest.enum';
import { UserInfo } from '../users/entities/user-info.entity';

@Injectable()
export class PointService {
  constructor(
    @InjectRepository(Quest) private readonly questRepository: Repository<Quest>,
    @InjectRepository(UserInfo) private readonly userInfoRepository: Repository<UserInfo>,
    private readonly dataSource: DataSource
  ) {}

  async updatePoint(userId: number, updatePointDto: UpdatePointDto) {
    const { questId, status } = updatePointDto;
    const currentDate = new Date();
    const userInfo = await this.userInfoRepository.findOne({ where: { userId } });
    if (!userInfo) {
      throw new HttpException('fail - User not found', HttpStatus.NOT_FOUND);
    }

    const quest = await this.questRepository.findOne({
      where: { id: questId, userId },
      relations: ['sideQuests'],
    });
    if (!quest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const difficultyPoint = this.getPointByDifficulty(quest.difficulty);
      quest.status = status;
      quest.updatedAt = currentDate;
      const completedSideQuestsCount = quest.sideQuests.filter(
        (sideQuest) => sideQuest.status === Status.Completed
      ).length;

      const totalPoint =
        quest.mode === Mode.Main ? completedSideQuestsCount * difficultyPoint : difficultyPoint;
      userInfo.point +=
        status === Status.Completed
          ? totalPoint
          : status === Status.onProgress
            ? -totalPoint
            : -difficultyPoint;

      if (userInfo.point < 0) userInfo.point = 0;

      await queryRunner.manager.save([quest, userInfo]);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getPointByDifficulty(difficulty: Difficulty): number {
    switch (difficulty) {
      case Difficulty.Default:
        return 2;
      case Difficulty.Easy:
        return 3;
      case Difficulty.Normal:
        return 4;
      case Difficulty.Hard:
        return 5;
      default:
        throw new HttpException('Invalid difficulty', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
