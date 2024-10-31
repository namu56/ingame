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
  async createSideQuests(questId: number, sideQuests: CreateSideQuestRequest[]) {
    const newSideQuests = sideQuests.map(({ content }) => {
      return SideQuest.create(questId, content);
    });

    await this.sideQuestRepository.save(newSideQuests);
  }

  async findSideQuests(questId: number): Promise<SideQuest[]> {
    return await this.sideQuestRepository.findByQuestId(questId);
  }

  async updateSideQuests(
    questId: number,
    currentSideQuests: SideQuest[],
    requests: UpdateSideQuestRequest[]
  ): Promise<void> {
    const currentSideQuestsMap = new Map(
      currentSideQuests.map((currentSideQuest) => [currentSideQuest.id, currentSideQuest])
    );

    const targets = requests
      .map((request) => {
        if (!request.id) return SideQuest.create(questId, request.content);

        const target = currentSideQuestsMap.get(request.id);
        if (!target) return null;

        target.updateContent(request.content);
        return target;
      })
      .filter(Boolean);

    const updateSideQuestIds = requests.map((updateSideQuest) => updateSideQuest.id);
    const deleteSideQuestIds = currentSideQuests
      .filter((currentSideQuest) => !updateSideQuestIds.includes(currentSideQuest.id))
      .map((deleteSideQuest) => deleteSideQuest.id);

    await Promise.all([
      targets.length && (await this.sideQuestRepository.save(targets)),
      deleteSideQuestIds.length && (await this.sideQuestRepository.delete(deleteSideQuestIds)),
    ]);
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
