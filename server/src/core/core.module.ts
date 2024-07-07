import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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

const modules = [
  CustomTypeOrmModule,
  TokenModule,
  PassportModule,
  AuthModule,
  UserModule,
  SchedulerModule,
  ScheduleModule.forRoot(),
  LevelCalculatorModule,
  WinstonLoggerMoudle,
];
const strategies = [JwtStrategy, LocalStrategy, GoogleStrategy];

@Global()
@Module({
  imports: [...modules],
  providers: [...strategies],
  exports: [...modules],
})
export class CoreModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*');
  }
}
