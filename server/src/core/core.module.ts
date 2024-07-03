import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LevelCalculatorService } from './level-calculator/level-calculator.service';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { WinstonLoggerMiddleware } from './middlewares/winston-logger.middleware';
import { CustomTypeOrmModule } from './database/typeorm/typeorm.module';
import { TokenModule } from './token/token.module';
import { GoogleStrategy, JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserModule } from 'src/modules/user/user.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ScheduleModule } from '@nestjs/schedule';

const modules = [
  CustomTypeOrmModule,
  TokenModule,
  PassportModule,
  AuthModule,
  UserModule,
  SchedulerModule,
  ScheduleModule.forRoot(),
];
const strategies = [JwtStrategy, LocalStrategy, GoogleStrategy];

@Global()
@Module({
  imports: [...modules],
  providers: [LevelCalculatorService, WinstonLoggerService, ...strategies],
  exports: [LevelCalculatorService, WinstonLoggerService, ...modules],
})
export class CoreModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*');
  }
}
