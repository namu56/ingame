import { UpdateSideQuestRequest } from '@common/requests/quest';
import {
  ISideQuestRepository,
  SIDE_QUEST_REPOSITORY_KEY,
} from '@entities/side-quest/side-quest-repository.interface';
import { SideQuest } from '@entities/side-quest/side-quest.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SideQuestService {
  constructor(
    @Inject(SIDE_QUEST_REPOSITORY_KEY) private readonly sideQuestRepository: ISideQuestRepository
  ) {}
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
  async updateSideQuestStatus() {}

  async deleteSideQuests() {}
}
