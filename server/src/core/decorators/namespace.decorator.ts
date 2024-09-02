import { ENTITY_MANAGER, TRANSACTION } from '@common/constants';
import { createNamespace, getNamespace } from 'cls-hooked';

export function Namespace() {
  return function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originMethod = descriptor.value;

    async function namespaceWrapped(...args: unknown[]) {
      const namespace = getNamespace(TRANSACTION) || createNamespace(TRANSACTION);

      return await namespace.runPromise(async () => {
        if (!namespace.get(ENTITY_MANAGER)) {
          namespace.set(ENTITY_MANAGER, this.entityManager);
        }
        return await originMethod.apply(this, args);
      });
    }
    descriptor.value = namespaceWrapped;
  };
}
