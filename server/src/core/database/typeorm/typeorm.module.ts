import { MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManager } from './transaction-manager';
import { TransactionMiddleware } from 'src/core/middlewares/transaction.middleware';
import { dataSourceOptions } from 'src/core/config';

const modules = [TypeOrmModule.forRoot(dataSourceOptions)];
const providers: Provider[] = [TransactionManager];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...providers],
})
export class CustomTypeOrmModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TransactionMiddleware).forRoutes('*');
  }
}
