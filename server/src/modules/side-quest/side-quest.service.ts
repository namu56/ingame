import {
  CreateSideQuestRequest,
  UpdateQuestStatusRequest,
  UpdateSideQuestRequest,
} from '@common/requests/quest';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { SideQuest } from '@entities/side-quest/side-quest.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SideQuestService {
  constructor(
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository
  ) {}
  async createSideQuests(
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

  async findSideQuests(questId: number): Promise<SideQuest[]> {
    return await this.sideQuestRepository.findByQuestId(questId);
  }

  async updateSideQuests(
    questId: number,
    sideQuestRequests: UpdateSideQuestRequest[]
  ): Promise<void> {
    const sideQuests = await this.findSideQuests(questId);
    const updatedSideQuests = sideQuests.filter((sideQuests) =>
      sideQuestRequests.some((sideQuestRequests) => sideQuestRequests.id === sideQuests.id)
    );

    for (const sideQuest of updatedSideQuests) {
      const target = sideQuestRequests.find(
        (sideQuestRequest) => sideQuestRequest.id === sideQuest.id
      );
      await sideQuest.updateContent(target.content);
      await this.sideQuestRepository.save(sideQuest);
    }
  }
  async updateSideQuestStatus(
    questId: number,
    sideQuestId: number,
    request: UpdateQuestStatusRequest
  ): Promise<void> {
    const sideQuest = await this.sideQuestRepository.findById(questId, sideQuestId);
    if (!sideQuest) {
      throw new HttpException('사이드 퀘스트가 존재하지 않습니다', HttpStatus.NOT_FOUND);
    }
    try {
      sideQuest.updateStatus(request.status);
      await this.sideQuestRepository.save(sideQuest);
    } catch (error) {
      throw new HttpException('사이드 퀘스트 업데이트에 실패하였습니다', HttpStatus.CONFLICT);
    }
  }

  async deleteSideQuests() {}
}
