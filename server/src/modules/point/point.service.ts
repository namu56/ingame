import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quest } from '../../entities/quest/quest.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdatePointDto } from '../../common/dto/point/update-point.dto';
import { Difficulty, Mode, Status } from '../../common/types/quest/quest.type';
import { UserInfo } from '../../entities/user-info/user-info.entity';

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
        (sideQuest) => sideQuest.status === Status.COMPLETED
      ).length;

      const totalPoint =
        quest.mode === Mode.MAIN ? completedSideQuestsCount * difficultyPoint : difficultyPoint;
      userInfo.point +=
        status === Status.COMPLETED
          ? totalPoint
          : status === Status.ON_PROGRESS
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
      case Difficulty.DEFAULT:
        return 2;
      case Difficulty.EASY:
        return 3;
      case Difficulty.NORMAL:
        return 4;
      case Difficulty.HARD:
        return 5;
      default:
        throw new HttpException('Invalid difficulty', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }
}
