import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Difficulty, Mode, Status } from '../../common/types/quest/quest.type';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import {
  IUserInfoRepository,
  USER_INFO_REPOSITORY_KEY,
} from '@entities/user-info/user-info-repository.interface';
import { Transactional } from '@core/decorators/transactional.decorator';
import { UpdatePointRequest } from '@common/requests/point';
import { IPointService } from './interfaces/point-service.interface';
import { Quest } from '@entities/quest/quest.entity';

@Injectable()
export class PointService implements IPointService {
  constructor(
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(USER_INFO_REPOSITORY_KEY) private readonly userInfoRepository: IUserInfoRepository
  ) {}

  @Transactional()
  async updatePoint(userId: number, request: UpdatePointRequest) {
    const { questId, status } = request;

    const userInfo = await this.userInfoRepository.findByUserId(userId);
    if (!userInfo) {
      throw new HttpException('유저의 정보가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    const quest = await this.questRepository.findById(userId, questId);
    if (!quest) {
      throw new HttpException('퀘스트가 존재하지 않습니다.', HttpStatus.NOT_FOUND);
    }

    try {
      const difficultyPoint = this.getPointByDifficulty(quest.difficulty);
      const totalPoint = this.calculateTotalPoint(quest, status, difficultyPoint);

      quest.updateStatus(status);
      userInfo.updatePoint(Math.max(0, userInfo.point + totalPoint));

      await this.questRepository.save(quest);
      await this.userInfoRepository.save(userInfo);
    } catch (error) {
      throw error;
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

  private calculateTotalPoint(quest: Quest, status: Status, difficultyPoint: number): number {
    const completedSideQuestsCount = quest.sideQuests.filter(
      (sideQuest) => sideQuest.status === Status.COMPLETED
    ).length;

    const totalPoint =
      quest.mode === Mode.MAIN ? completedSideQuestsCount * difficultyPoint : difficultyPoint;

    switch (status) {
      case Status.COMPLETED:
        return totalPoint;
      case Status.ON_PROGRESS:
        return -totalPoint;
      default:
        return -difficultyPoint;
    }
  }
}
