import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { QuestModule } from './modules/quest/quest.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/filters/all-exceptions.filter';
import { PointModule } from './modules/point/point.module';
import { CoreModule } from './core/core.module';
import { SideQuestModule } from '@modules/side-quest/side-quest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    CoreModule,
    UserModule,
    AuthModule,
    QuestModule,
    SideQuestModule,
    RankingModule,
    PointModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
