import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LevelCalculatorService } from './level-calculator/level-calculator.service';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { redisProviders } from './database/redis/redis.provider';
import { WinstonLoggerMiddleware } from './middlewares/winston-logger.middleware';
import { CustomTypeOrmModule } from './database/typeorm/typeorm.module';

const modules = [CustomTypeOrmModule];

@Module({
  imports: [...modules],
  providers: [LevelCalculatorService, WinstonLoggerService, ...redisProviders],
  exports: [LevelCalculatorService, WinstonLoggerService, ...modules, ...redisProviders],
})
export class CoreModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware).forRoutes('*');
  }
}