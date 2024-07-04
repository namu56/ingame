import { ClassProvider, Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { RANKING_SERVICE_KEY } from './interfaces/ranking-service.interface';
import { UserInfoRepositoryModule } from 'src/entities/user-info/user-info-repository.module';

const rankingService: ClassProvider = {
  provide: RANKING_SERVICE_KEY,
  useClass: RankingService,
};

@Module({
  imports: [UserInfoRepositoryModule],
  controllers: [RankingController],
  providers: [rankingService],
})
export class RankingModule {}
