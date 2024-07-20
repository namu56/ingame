import { Injectable, NestMiddleware } from '@nestjs/common';
import { Namespace, createNamespace, getNamespace } from 'cls-hooked';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';
import { ENTITY_MANAGER, TRANSACTION } from '../../common/constants/transaction.constant';

@Injectable()
export class TransactionMiddleware implements NestMiddleware {
  constructor(private readonly entityManager: EntityManager) {}
  use(_req: Request, _res: Response, next: NextFunction) {
    const namespace = getNamespace(TRANSACTION) ?? createNamespace(TRANSACTION);

    return namespace.runAndReturn(async () => {
      Promise.resolve()
        .then(() => this.setEntityManager())
        .then(next);
    });
  }
  private setEntityManager() {
    const namespace = getNamespace(TRANSACTION) as Namespace;
    namespace.set(ENTITY_MANAGER, this.entityManager);
  }
}
