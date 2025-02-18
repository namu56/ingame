import { ClassProvider, Module } from '@nestjs/common';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { UserInfoRepositoryModule } from '@entities/user-info/user-info-repository.module';
import { QuestRepositoryModule } from '@entities/quest/quest-repository.module';
import { POINT_SERVICE_KEY } from './interfaces/point-service.interface';
import { SideQuestRepositoryModule } from '@entities/side-quest/side-quest-repository.module';

const pointService: ClassProvider = {
  provide: POINT_SERVICE_KEY,
  useClass: PointService,
};

@Module({
  imports: [UserInfoRepositoryModule, QuestRepositoryModule, SideQuestRepositoryModule],
  providers: [pointService],
  controllers: [PointController],
  exports: [pointService],
})
export class PointModule {}
