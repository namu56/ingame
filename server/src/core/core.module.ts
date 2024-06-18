import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TransactionMiddleware } from './middlewares/transaction.middleware';
import { TransactionManager } from '../common/utils/transaction-manager.util';
import { LevelCalculatorService } from './level-calculator/level-calculator.service';
import { WinstonLoggerService } from './logger/winston-logger.service';
import { redisProviders } from './database/redis/redis.provider';
import { WinstonLoggerMiddleware } from './middlewares/winston-logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/configs/datasource.config';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  providers: [
    TransactionMiddleware,
    TransactionManager,
    LevelCalculatorService,
    WinstonLoggerService,
    ...redisProviders,
  ],
  exports: [TransactionManager, LevelCalculatorService, WinstonLoggerService, ...redisProviders],
})
export class CoreModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(WinstonLoggerMiddleware, TransactionMiddleware).forRoutes('*');
  }
}
