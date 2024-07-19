import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Quest } from '../../entities/quest/quest.entity';
import { SideQuest } from '../../entities/side-quest/side-quest.entity';
import { Mode } from '../../common/types/quest/quest.type';
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
  UpdateSideQuestRequest,
} from '@common/requests/quest';
import { toUTCStartOfDay } from '@common/utils/date.util';
import { MainQuestResponse } from '@common/responses/quest';
import { SubQuestResponse } from '@common/responses/quest/sub-quest.response';
import { plainToInstance } from 'class-transformer';
import { UpdateSubQuestRequest } from '@common/requests/quest/update-sub-quest.request';

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
      throw new HttpException('퀘스트를 생성하는데 실패했습니다', HttpStatus.CONFLICT);
    }
  }

  async updateQuestStatus(
    userId: number,
    questId: number,
    request: UpdateQuestStatusRequest
  ): Promise<void> {
    try {
      const quest = await this.questRepository.findById(userId, questId);
      if (!quest) {
        throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
      }
      quest.updateStatus(request.status);
      this.questRepository.save(quest);
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
      let quest = await this.findMainById(userId, questId);
      const updateSideQuests = await this.updateSideQuests(quest.sideQuests, sideQuests);
      quest.updateMainQuest(title, difficulty, hidden, startDate, endDate, updateSideQuests);

      this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  private async updateSideQuests(
    sideQuests: SideQuest[],
    sideQuestRequests: UpdateSideQuestRequest[]
  ): Promise<SideQuest[]> {
    sideQuests = sideQuests.filter((sideQuest) =>
      sideQuestRequests.some((sideQuestRequest) => sideQuestRequest.id === sideQuest.id)
    );

    for (const sideQuest of sideQuests) {
      const target = sideQuestRequests.find(
        (sideQuestRequest) => sideQuestRequest.id === sideQuest.id
      );
      sideQuest.updateContent(target.content);
    }

    return sideQuests;
  }

  async updateSubQuest(
    userId: number,
    questId: number,
    request: UpdateSubQuestRequest
  ): Promise<void> {
    try {
      const { title, hidden } = request;
      let quest = await this.findSubById(userId, questId);
      quest.updateSubQuest(title, hidden);
      this.questRepository.save(quest);
    } catch (error) {
      throw new HttpException('퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async deleteQuest(userId: number, questId: number): Promise<void> {
    const quest = await this.questRepository.findMainQuest(questId, userId);
    if (!quest) {
      throw new HttpException('퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
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
