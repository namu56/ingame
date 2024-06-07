import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransactionMiddleware } from './middleware/transaction.middleware';
import { TransactionManager } from './utils/transaction-manager.util';
import { LevelCalculatorService } from './level-calculator/level-calculator.service';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { redisProviders } from './redis/redis.provider';
import { WinstonLoggerMiddleware } from './middleware/winston-logger.middleware';

@Module({
  providers: [
    TransactionMiddleware,
    TransactionManager,
    LevelCalculatorService,
    WinstonLoggerService,
    ...redisProviders,
  ],
  exports: [TransactionManager, LevelCalculatorService, WinstonLoggerService, ...redisProviders],
})
export class CommonModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TransactionMiddleware, WinstonLoggerMiddleware).forRoutes('*');
  }
}
