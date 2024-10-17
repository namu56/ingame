import { InternalServerErrorException } from '@nestjs/common';
import { ENTITY_MANAGER, TRANSACTION } from '../../common/constants/transaction.constant';
import { getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';

export function Transactional() {
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;

    async function transactionWrapped(...args: unknown[]) {
      const namespace = getNamespace(TRANSACTION);
      if (!namespace || !namespace.active) {
        throw new InternalServerErrorException(`${TRANSACTION} is not active`);
      }

      const entityManager = namespace.get(ENTITY_MANAGER) as EntityManager;
      if (!entityManager) {
        throw new InternalServerErrorException(
          `Could not find EntityManager in ${TRANSACTION} namespace`
        );
      }

      return await entityManager.transaction(async (transactionalEntityManager: EntityManager) => {
        namespace.set(ENTITY_MANAGER, transactionalEntityManager);
        return await originMethod.apply(this, args);
      });
    }

    descriptor.value = transactionWrapped;
  };
}
