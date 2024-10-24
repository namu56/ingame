import { ENTITY_MANAGER, TRANSACTION } from '@common/constants';
import { createNamespace, getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';

export function Namespace() {
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;

    async function namespaceWrapped(...args: unknown[]) {
      const namespace = getNamespace(TRANSACTION) ?? createNamespace(TRANSACTION);
      const entityManager: EntityManager = this.dataSource.createEntityManager();

      return await namespace.runPromise(async () => {
        namespace.set(ENTITY_MANAGER, entityManager);

        await originMethod.apply(this, args);
      });
    }
    descriptor.value = namespaceWrapped;
  };
}
