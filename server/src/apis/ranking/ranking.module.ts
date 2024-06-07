import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { UsersModule } from '../users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [UsersModule, CommonModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
