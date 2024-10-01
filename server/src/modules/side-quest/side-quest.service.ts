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
    const deleteSideQuestIds = new Set(sideQuests.map((sideQuest) => sideQuest.id));

    for (const request of sideQuestRequests) {
      if (request.id) {
        const target = sideQuests.find((sideQuest) => sideQuest.id === request.id);
        if (target) {
          deleteSideQuestIds.delete(request.id);
          await target.updateContent(request.content);
          await this.sideQuestRepository.save(target);
        }
      } else {
        const newSideQuest = SideQuest.create(questId, request.content);
        await this.sideQuestRepository.save(newSideQuest);
      }
    }

    if (deleteSideQuestIds.size > 0) {
      await this.sideQuestRepository.delete(Array.from(deleteSideQuestIds));
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
}
