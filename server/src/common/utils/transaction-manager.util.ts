import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getNamespace } from 'cls-hooked';
import { EntityManager } from 'typeorm';
import { ENTITY_MANAGER, TRANSACTION } from './constants.util';

@Injectable()
export class TransactionManager {
  public getEntityManager(): EntityManager {
    const namespace = getNamespace(TRANSACTION);
    if (!namespace || !namespace.active)
      throw new InternalServerErrorException(`${TRANSACTION} is not active`);
    return namespace.get(ENTITY_MANAGER);
  }
}
