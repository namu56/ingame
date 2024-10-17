import { SideQuestRepositoryModule } from '@entities/side-quest/side-quest-repository.module';
import { Module } from '@nestjs/common';
import { SideQuestController } from './side-quest.controller';
import { SideQuestService } from './side-quest.service';

@Module({
  imports: [SideQuestRepositoryModule],
  exports: [SideQuestService],
  providers: [SideQuestService],
  controllers: [SideQuestController],
})
export class SideQuestModule {}
