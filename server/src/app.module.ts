import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { QuestModule } from './modules/quest/quest.module';
import { AuthModule } from './modules/auth/auth.module';
import { PointModule } from './modules/point/point.module';
import { CoreModule } from './core/core.module';
import { SideQuestModule } from '@modules/side-quest/side-quest.module';

const applicationModule = [
  CoreModule,
  UserModule,
  AuthModule,
  QuestModule,
  SideQuestModule,
  RankingModule,
  PointModule,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    ...applicationModule,
  ],
})
export class AppModule {}
