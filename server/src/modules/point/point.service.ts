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
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { UserInfo } from '@entities/user-info/user-info.entity';

@Injectable()
export class PointService implements IPointService {
  constructor(
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(USER_INFO_REPOSITORY_KEY) private readonly userInfoRepository: IUserInfoRepository,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository
  ) {}

  @Transactional()
  async updatePointForQuest(userId: number, request: UpdatePointRequest) {
    const { questId, status } = request;
    const userInfo = await this.userInfoRepository.findByUserId(userId);
    const quest = await this.questRepository.findById(userId, questId);
    try {
      await this.handlePointForQuest(userInfo, quest, status);
    } catch (error) {
      throw new HttpException('포인트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async updatePointForExpiredQuest(quest: Quest, status: Status): Promise<void> {
    const userInfo = await this.userInfoRepository.findByUserId(quest.userId);
    if (!userInfo) return;

    await this.handlePointForQuest(userInfo, quest, status);
  }

  private async handlePointForQuest(
    userInfo: UserInfo,
    quest: Quest,
    status: Status
  ): Promise<void> {
    const difficultyPoint = this.getPointByDifficulty(quest.difficulty);
    const calculatedPoint = await this.calculatePoint(quest, status, difficultyPoint);

    quest.updateStatus(status);
    userInfo.updatePoint(Math.max(0, userInfo.point + calculatedPoint));

    await this.questRepository.save(quest);
    await this.userInfoRepository.save(userInfo);
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
  private async calculatePoint(
    quest: Quest,
    status: Status,
    difficultyPoint: number
  ): Promise<number> {
    let totalPoint: number;

    // 메인 퀘스트일 시
    if (quest.mode === Mode.Main) {
      const sideQuests = await this.sideQuestRepository.findByQuestId(quest.id);
      const completedSideQuestsCount = sideQuests.filter(
        (sideQuest) => sideQuest.status === Status.Completed
      ).length;

      totalPoint = completedSideQuestsCount * difficultyPoint;
    }

    // 서브 퀘스트일 시
    if (quest.mode === Mode.Sub) {
      totalPoint = difficultyPoint;
    }

    switch (status) {
      case Status.Completed:
        return totalPoint;
      case Status.OnProgress:
        return -totalPoint;
      default:
        return -difficultyPoint;
    }
  }
}
