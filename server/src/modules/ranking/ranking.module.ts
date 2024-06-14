import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { UsersModule } from '../user/user.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [UsersModule, CoreModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
