import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TransactionMiddleware } from './middleware/transaction.middleware';
import { TransactionManager } from './utils/transaction-manager.util';

@Module({
  providers: [TransactionMiddleware, TransactionManager],
  exports: [TransactionManager],
})
export class CommonModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
