import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Status } from '../../common/types/quest/quest.type';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import { getExpiredDate } from '@common/utils/date.util';
import { DataSource } from 'typeorm';
import { Namespace } from '@core/decorators/namespace.decorator';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { Transactional } from '@core/decorators/transactional.decorator';
import { SideQuest } from '@entities/side-quest/side-quest.entity';
import { Quest } from '@entities/quest/quest.entity';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @InjectDataSource() private dataSource: DataSource,
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository,
    @Inject(POINT_SERVICE_KEY) private readonly pointService: IPointService
  ) {}

  @Namespace()
  @Transactional()
  async updateExpiredMainQuests() {
    try {
      const expiredDate = getExpiredDate();
      const mainQuests = await this.questRepository.findExpiredMainQuests(expiredDate);

      if (mainQuests.length === 0) {
        this.logger.log('만료된 메인 퀘스트가 존재하지 않습니다');
        return;
      }

      await Promise.all(mainQuests.map((mainQuest) => this.processExpiredMainQuest(mainQuest)));
    } catch (error) {
      this.logger.warn({ message: '메인 퀘스트 스케쥴링에 실패하였습니다', stack: error.stack });
    }
  }

  @Namespace()
  @Transactional()
  async updateExpiredSubQuests() {
    try {
      const expiredDate = getExpiredDate();
      const subQuests = await this.questRepository.findExpiredSubQuests(expiredDate);

      if (subQuests.length === 0) {
        this.logger.log('만료된 서브 퀘스트가 존재하지 않습니다');
        return;
      }

      await Promise.all(
        subQuests.map((subQuest) =>
          this.pointService.updatePointForExpiredQuest(subQuest, Status.Fail)
        )
      );
    } catch (error) {
      this.logger.warn({ message: '서브 퀘스트 스케쥴링에 실패하였습니다', stack: error.stack });
    }
  }

  private async processExpiredMainQuest(mainQuest: Quest) {
    const sideQuests = await this.sideQuestRepository.findByQuestId(mainQuest.id);
    const newStatus = this.newStatus(sideQuests);

    await this.updateSideQuests(sideQuests);
    await this.pointService.updatePointForExpiredQuest(mainQuest, newStatus);
  }

  private newStatus(sideQuests: SideQuest[]): Status {
    const completedSideQuestsCount = sideQuests.filter(
      (sideQuest) => sideQuest.status === Status.Completed
    ).length;

    return completedSideQuestsCount > 0 ? Status.Completed : Status.Fail;
  }

  private async updateSideQuests(sideQuests: SideQuest[]) {
    const onProgressSideQuests = sideQuests.filter(
      (sideQuest) => sideQuest.status === Status.OnProgress
    );

    await Promise.all(
      onProgressSideQuests.map((sideQuest) => {
        sideQuest.updateStatus(Status.Fail);
        return this.sideQuestRepository.save(sideQuest);
      })
    );
  }
}
