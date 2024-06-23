import { ClassProvider, Module } from '@nestjs/common';
import { QUEST_REPOSITORY_KEY } from './quest-repository.interface';
import { QuestRepository } from './quest.repository';

export const questRepository: ClassProvider = {
  provide: QUEST_REPOSITORY_KEY,
  useClass: QuestRepository,
};

@Module({
  providers: [questRepository],
  exports: [questRepository],
})
export class QuestRepositoryModule {}
