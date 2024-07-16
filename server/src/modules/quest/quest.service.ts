import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateSideQuestDto } from '../../common/dto/quest/update-side-quest.dto';
import { Quest } from '../../entities/quest/quest.entity';
import { FindManyOptions, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { SideQuest } from '../../entities/side-quest/side-quest.entity';
import { Mode, Status } from '../../common/types/quest/quest.type';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { Transactional } from '@core/decorators/transactional.decorator';
import { CreateQuestRequest, CreateSideQuestRequest } from '@common/requests/quest';
import { toUTCStartOfDay } from '@common/utils/date.util';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';

@Injectable()
export class QuestService {
  constructor(
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository
  ) {}

  @Transactional()
  async create(userId: number, request: CreateQuestRequest): Promise<void> {
    const { mode, sideQuests } = request;
    try {
      const quest = await this.createQuest(userId, request);

      if (mode === Mode.MAIN) await this.createSideQuest(quest.id, sideQuests);
    } catch (error) {
      throw error;
    }
  }

  private async createQuest(userId: number, request: CreateQuestRequest): Promise<Quest> {
    const { title, difficulty, mode, startDate, endDate, hidden } = request;

    const quest =
      mode === Mode.MAIN
        ? Quest.createMainQuest(userId, title, difficulty, startDate, endDate, hidden)
        : Quest.createSubQuest(userId, title, startDate, endDate, hidden);

    return this.questRepository.save(quest);
  }

  private async createSideQuest(
    questId: number,
    sideQuests: CreateSideQuestRequest[]
  ): Promise<void> {
    for (const sideQuest of sideQuests) {
      const { content } = sideQuest;
      await this.sideQuestRepository.save(SideQuest.create(questId, content));
    }
  }

  async findMainQuests(userId: number, dateString: string): Promise<MainQuestResponse[]> {
    const date = toUTCStartOfDay(dateString);
    const quests = await this.questRepository.findMainQuests(userId, date);
    if (!quests) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return quests;
  }

  async findSubQuests(userId: number, dateString: string): Promise<SubQuestResponse[]> {
    const date = toUTCStartOfDay(dateString);
    const quests = await this.questRepository.findSubQuests(userId, date);
    if (!quests) {
      throw new HttpException('서브 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return quests;
  }

  async findOne(userId: number, questId: number) {
    const options: FindManyOptions<Quest> = {
      where: { id: questId, userId: userId, mode: Mode.MAIN },
      order: {
        id: 'DESC',
      },
      relations: ['sideQuests'],
      select: [
        'id',
        'title',
        'difficulty',
        'mode',
        'start',
        'end',
        'hidden',
        'status',
        'createdAt',
        'updatedAt',
      ],
    };

    const quests = await this.questRepository.findOne(options);

    if (!quests) {
      throw new HttpException('fail - Quests not found', HttpStatus.NOT_FOUND);
    }

    return quests;
  }

  async update(userId: number, questId: number, updateQuestDto: UpdateQuestDto) {
    const currentDate = new Date();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetQuest = await this.questRepository.findOne({
        where: { userId: userId, id: questId },
      });

      if (!targetQuest) {
        throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
      }

      const updatedQuest = this.questRepository.merge(targetQuest, {
        ...updateQuestDto,
        updatedAt: currentDate,
      });
      await queryRunner.manager.save(updatedQuest);

      if (updateQuestDto.sideQuests) {
        const targetSideQuests = await this.sideQuestRepository.find({
          where: { questId: questId },
        });
        const updateSideQuestList = updateQuestDto.sideQuests.filter((sideQuest) => sideQuest.id);
        const deleteSideQuestIdList = targetSideQuests.filter(
          (sideQuest) =>
            !updateSideQuestList.some((sideQuestItem) => sideQuestItem.id === sideQuest.id)
        );

        for (const sideQuest of updateSideQuestList) {
          const targetSideQuest = targetSideQuests.find(
            (sideQuestItem) => sideQuestItem.id === sideQuest.id
          );
          if (!targetSideQuest) {
            throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
          }

          const updatedQuest = this.sideQuestRepository.merge(targetSideQuest, {
            ...sideQuest,
            updatedAt: currentDate,
          });
          await queryRunner.manager.save(updatedQuest);
        }

        for (const sideQuest of deleteSideQuestIdList) {
          await queryRunner.manager.delete(SideQuest, { id: sideQuest.id });
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(userId: number, questId: number) {
    const targetQuest = await this.questRepository.findOne({
      where: { userId: userId, id: questId },
    });
    if (!targetQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete({ id: questId });
  }

  async updateSideStatus(userId: number, questId: number, updateQuestDto: UpdateSideQuestDto) {
    const currentDate = new Date();

    const targetSideQuest = await this.sideQuestRepository.findOne({
      where: { id: questId },
    });
    if (!targetSideQuest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const quest = await this.questRepository.find({
      where: { id: updateQuestDto.questId, userId: userId },
    });
    if (!quest) {
      throw new HttpException('fail - Quest not found', HttpStatus.NOT_FOUND);
    }

    const updatedSideQuest = this.sideQuestRepository.merge(targetSideQuest, {
      status: updateQuestDto.status,
      updatedAt: currentDate,
    });
    await this.sideQuestRepository.save(updatedSideQuest);
  }
}
