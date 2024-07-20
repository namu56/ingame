import { Module } from '@nestjs/common';
import { QuestService } from './quest.service';
import { QuestController } from './quest.controller';
import { QuestRepositoryModule } from '@entities/quest/quest-repository.module';
import { SideQuestRepositoryModule } from '@entities/side-quest/side-quest-repository.module';

@Module({
  imports: [QuestRepositoryModule, SideQuestRepositoryModule],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
