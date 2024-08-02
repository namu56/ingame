import { Module } from '@nestjs/common';
import { QuestService } from './services/quest.service';
import { QuestController } from './quest.controller';
import { QuestRepositoryModule } from '@entities/quest/quest-repository.module';
import { SideQuestModule } from '@modules/side-quest/side-quest.module';

@Module({
  imports: [QuestRepositoryModule, SideQuestModule],
  providers: [QuestService],
  controllers: [QuestController],
})
export class QuestModule {}
