import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user/user.module';
import { RankingModule } from './modules/ranking/ranking.module';
import { QuestsModule } from './modules/quest/quests.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './core/filters/all-exception.filter';
import { SchedulerModule } from './core/scheduler/scheduler.module';
import { PointModule } from './modules/point/point.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    SchedulerModule,
    UsersModule,
    AuthModule,
    QuestsModule,
    RankingModule,
    PointModule,
    CoreModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
