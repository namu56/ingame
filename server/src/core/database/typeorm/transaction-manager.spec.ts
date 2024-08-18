import { InternalServerErrorException } from '@nestjs/common';
import { TransactionManager } from './transaction-manager';
import { TRANSACTION } from '@common/constants';
import { createNamespace } from 'cls-hooked';

describe('Transaction Manager Test', () => {
  it('NameSpace가 없는 경우', () => {
    const manager = new TransactionManager();

    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });

  it('NameSpace는 존재하지만, Active가 아닌 경우', () => {
    const manager = new TransactionManager();
    createNamespace(TRANSACTION);

    expect(() => manager.getEntityManager()).toThrow(
      new InternalServerErrorException(`${TRANSACTION} is not active`)
    );
  });
});
