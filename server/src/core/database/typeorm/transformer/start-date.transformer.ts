import { toDateString, toStartUTC } from '@common/utils/date.util';
import { ValueTransformer } from 'typeorm';

export class StartDateTransformer implements ValueTransformer {
  to(value: string): Date {
    return toStartUTC(value);
  }
  from(value: Date): string {
    return toDateString(value);
  }
}
