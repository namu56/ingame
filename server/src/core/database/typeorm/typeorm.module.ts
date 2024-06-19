import { MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/configs/datasource.config';
import { TransactionManager } from './transaction-manager';
import { TransactionMiddleware } from 'src/core/middlewares/transaction.middleware';

const providers: Provider[] = [TransactionManager];

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions)],
  providers: [...providers],
  exports: [...providers],
})
export class CustomTypeOrmModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
