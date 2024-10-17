import { ClassProvider, Module } from '@nestjs/common';
import { SIDE_QUEST_REPOSITORY_KEY } from './side-quest-repository.interface';
import { SideQuestRepository } from './side-quest.repository';

export const sideQuestRepository: ClassProvider = {
  provide: SIDE_QUEST_REPOSITORY_KEY,
  useClass: SideQuestRepository,
};

@Module({
  providers: [sideQuestRepository],
  exports: [sideQuestRepository],
})
export class SideQuestRepositoryModule {}
