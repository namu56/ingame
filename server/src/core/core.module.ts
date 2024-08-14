import {
  ClassProvider,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  Logger,
} from '@nestjs/common';
import { WinstonLoggerMiddleware } from './middlewares/winston-logger.middleware';
import { CustomTypeOrmModule } from './database/typeorm/typeorm.module';
import { TokenModule } from './token/token.module';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LevelCalculatorModule } from './level-calculator/level-calculator.module';
import { WinstonLoggerMoudle } from './logger/winston-logger.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggerContextMiddleware } from './middlewares';

const modules = [
  CustomTypeOrmModule,
  TokenModule,
  PassportModule,
  AuthModule,
  UserModule,
  SchedulerModule,
  ScheduleModule.forRoot(),
  LevelCalculatorModule,
  // WinstonLoggerMoudle,
];
const strategies = [JwtStrategy, LocalStrategy, GoogleStrategy];
const filters: ClassProvider[] = [{ provide: APP_FILTER, useClass: AllExceptionsFilter }];

@Global()
@Module({
  imports: [...modules],
  providers: [Logger, ...strategies, ...filters],
  exports: [...modules],
})
export class CoreModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerContextMiddleware).forRoutes('*');
  }
}
