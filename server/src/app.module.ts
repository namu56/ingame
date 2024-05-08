import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './common/config/typeorm.config';
import { UsersModule } from './apis/users/users.module';
import { RankingModule } from './apis/ranking/ranking.module';
import { QuestsModule } from './apis/quests/quests.module';
import { AuthModule } from './apis/auth/auth.module';
import { WinstonLoggerMiddleware } from './common/middleware/winston-logger.middleware';
import { WinstonLoggerModule } from './common/logger/winston-logger.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.production.env' : '.development.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => typeORMConfig(configService),
    }),
    WinstonLoggerModule,
    UsersModule,
    AuthModule,
    QuestsModule,
    RankingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*');
  }
}
