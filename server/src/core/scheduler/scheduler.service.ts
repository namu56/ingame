import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
} from '@nestjs/common';
import { Status } from '../../common/types/quest/quest.type';
import {
  IPointService,
  POINT_SERVICE_KEY,
} from '@modules/point/interfaces/point-service.interface';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import { getExpiredDate } from '@common/utils/date.util';
import { EntityManager } from 'typeorm';
import { Namespace } from '@core/decorators/namespace.decorator';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { Transactional } from '@core/decorators/transactional.decorator';

@Injectable()
export class SchedulerService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository,
    @Inject(POINT_SERVICE_KEY) private readonly pointService: IPointService
  ) {}

  @Namespace()
  @Transactional()
  async updateExpiredMainQuests() {
    try {
      const date = getExpiredDate();
      const mainQuests = await this.questRepository.findExpiredMainQuests(date);

      if (mainQuests.length === 0) {
        this.logger.log('만료된 메인 퀘스트가 존재하지 않습니다');
        return;
      }

      for (const mainQuest of mainQuests) {
        const sideQuests = await this.sideQuestRepository.findByQuestId(mainQuest.id);

        const completedSideQuestsCount = sideQuests.filter(
          (sideQuest) => sideQuest.status === Status.Completed
        ).length;

        const newStatus = completedSideQuestsCount > 0 ? Status.Completed : Status.Fail;

        if (sideQuests.length > 0) {
          sideQuests
            .filter((sideQuest) => sideQuest.status === Status.OnProgress)
            .forEach((sideQuest) => sideQuest.updateStatus(Status.Fail));

          await this.pointService.updatePointForExpiredQuest(mainQuest, newStatus);

          for (const sideQuest of sideQuests) {
            await this.sideQuestRepository.save(sideQuest);
          }
        } else {
          await this.pointService.updatePointForExpiredQuest(mainQuest, newStatus);
        }
      }
    } catch (error) {
      this.logger.warn({ message: '메인 퀘스트 스케쥴링에 실패하였습니다', stack: error.stack });
    }
  }
  @Namespace()
  @Transactional()
  async updateExpiredSubQuests() {
    try {
      const date = getExpiredDate();
      const subQuests = await this.questRepository.findExpiredSubQuests(date);

      if (subQuests.length === 0) {
        this.logger.log('만료된 서브 퀘스트가 존재하지 않습니다');
        return;
      }

      for (const subQuest of subQuests) {
        await this.pointService.updatePointForExpiredQuest(subQuest, Status.Fail);
      }
    } catch (error) {
      throw new HttpException('서브 퀘스트 스케쥴링에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }
}
