import { Module } from '@nestjs/common';
import { QuestService } from './services/quest.service';
import { QuestController } from './quest.controller';
import { QuestRepositoryModule } from '@entities/quest/quest-repository.module';
import { SideQuestRepositoryModule } from '@entities/side-quest/side-quest-repository.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quest } from '@entities/quest/quest.entity';
import { SideQuest } from '@entities/side-quest/side-quest.entity';
import { SideQuestService } from './services/side-quest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quest, SideQuest]),
    QuestRepositoryModule,
    SideQuestRepositoryModule,
  ],
  controllers: [QuestController],
  providers: [QuestService, SideQuestService],
})
export class QuestModule {}
