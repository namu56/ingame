import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Quest } from '../../../entities/quest/quest.entity';
import { SideQuest } from '../../../entities/side-quest/side-quest.entity';
import { Mode } from '../../../common/types/quest/quest.type';
import { IQuestRepository, QUEST_REPOSITORY_KEY } from '@entities/quest/quest-repository.interface';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { Transactional } from '@core/decorators/transactional.decorator';
import {
  CreateQuestRequest,
  CreateSideQuestRequest,
  UpdateMainQuestRequest,
  UpdateQuestStatusRequest,
} from '@common/requests/quest';
import { toUTCStartOfDay } from '@common/utils/date.util';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';
import { plainToInstance } from 'class-transformer';
import { UpdateSubQuestRequest } from '@common/requests/quest/update-sub-quest.request';
import { SideQuestService } from '@modules/quest/services/side-quest.service';

@Injectable()
export class QuestService {
  constructor(
    @Inject(QUEST_REPOSITORY_KEY) private readonly questRepository: IQuestRepository,
    private readonly sideQuestService: SideQuestService,
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository
  ) {}

  @Transactional()
  async create(userId: number, request: CreateQuestRequest): Promise<void> {
    const { mode, sideQuests } = request;
    try {
      const quest = await this.createQuest(userId, request);

      if (mode === Mode.MAIN) {
        const newSideQuests = await this.createSideQuests(quest.id, sideQuests);
        quest.updateSideQuests(newSideQuests);
      }

      await this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트를 생성하는데 실패했습니다', HttpStatus.CONFLICT);
    }
  }

  async updateQuestStatus(
    userId: number,
    questId: number,
    request: UpdateQuestStatusRequest
  ): Promise<void> {
    try {
      const quest = await this.findById(userId, questId);
      quest.updateStatus(request.status);

      await this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트 상태 변경에 실패했습니다', HttpStatus.CONFLICT);
    }
  }

  async findMainQuests(userId: number, dateString: string): Promise<MainQuestResponse[]> {
    const date = toUTCStartOfDay(dateString);
    const quests = await this.questRepository.findMainQuests(userId, date);
    if (!quests) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(MainQuestResponse, quests);
  }

  async findSubQuests(userId: number, dateString: string): Promise<SubQuestResponse[]> {
    const date = toUTCStartOfDay(dateString);
    const quests = await this.questRepository.findSubQuests(userId, date);
    if (!quests) {
      throw new HttpException('서브 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(SubQuestResponse, quests);
  }

  async findMainQuest(userId: number, questId: number): Promise<MainQuestResponse> {
    const quest = await this.findMainById(userId, questId);

    return plainToInstance(MainQuestResponse, quest);
  }

  @Transactional()
  async updateMainQuest(
    userId: number,
    questId: number,
    request: UpdateMainQuestRequest
  ): Promise<void> {
    try {
      const { title, difficulty, startDate, endDate, hidden, sideQuests } = request;
      const quest = await this.findById(userId, questId);
      quest.updateMainQuest(title, difficulty, hidden, startDate, endDate);

      await this.sideQuestService.updateSideQuests(questId, sideQuests);
      await this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async updateSubQuest(
    userId: number,
    questId: number,
    request: UpdateSubQuestRequest
  ): Promise<void> {
    try {
      const { title, hidden } = request;
      let quest = await this.findById(userId, questId);
      quest.updateSubQuest(title, hidden);
      this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async deleteMainQuest(userId: number, questId: number): Promise<void> {
    const quest = await this.questRepository.findMainQuest(userId, questId);
    if (!quest) {
      throw new HttpException('메인 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete(questId);
  }

  async deleteSubQuest(userId: number, questId: number): Promise<void> {
    const quest = await this.questRepository.findSubQuest(userId, questId);
    if (!quest) {
      throw new HttpException('서브 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }

    await this.questRepository.delete(questId);
  }

  async updateSideQuestStatus(
    userId: number,
    sideQuestId: number,
    request: UpdateQuestStatusRequest
  ): Promise<void> {
    try {
      const sideQuest = await this.sideQuestRepository.findById(userId, sideQuestId);
      if (!sideQuest) {
        throw new HttpException('사이드 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
      }
      sideQuest.updateStatus(request.status);
      this.sideQuestRepository.save(sideQuest);
    } catch (error) {
      throw new HttpException('사이드 퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  private async createQuest(userId: number, request: CreateQuestRequest): Promise<Quest> {
    const { title, difficulty, mode, hidden, startDate, endDate } = request;

    const quest =
      mode === Mode.MAIN
        ? Quest.createMainQuest(userId, title, difficulty, startDate, endDate, hidden)
        : Quest.createSubQuest(userId, title, startDate, endDate, hidden);

    return quest;
  }

  private async createSideQuests(
    questId: number,
    sideQuests: CreateSideQuestRequest[]
  ): Promise<SideQuest[]> {
    const newSideQuests: SideQuest[] = [];
    for (const sideQuest of sideQuests) {
      const { content } = sideQuest;
      newSideQuests.push(SideQuest.create(questId, content));
    }
    return newSideQuests;
  }

  private async findById(userId: number, questId: number): Promise<Quest> {
    const quest = await this.questRepository.findById(userId, questId);
    if (!quest) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return quest;
  }

  private async findMainById(userId: number, questId: number): Promise<Quest> {
    const quest = await this.questRepository.findMainQuest(userId, questId);
    if (!quest) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return quest;
  }

  private async findSubById(userId: number, questId: number): Promise<Quest> {
    const quest = await this.questRepository.findSubQuest(userId, questId);
    if (!quest) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    return quest;
  }
}
