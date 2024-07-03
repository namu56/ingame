import { ValueTransformer } from 'typeorm';

export class BigIntTransformer implements ValueTransformer {
  to(entityValue: number): number {
    return entityValue;
  }
  from(databaseValue: string): number {
    return Number(databaseValue);
  }
}
