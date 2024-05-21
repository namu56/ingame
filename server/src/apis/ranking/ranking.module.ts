import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { UsersModule } from '../users/users.module';
import { LevelCalculatorModule } from 'src/common/level-calculator/level-calculator.module';

@Module({
  imports: [UsersModule, LevelCalculatorModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
