import { toDateString, toEndUTC } from '@common/utils/date.util';
import { ValueTransformer } from 'typeorm';

export class EndDateTransformer implements ValueTransformer {
  to(value: string): Date {
    return toEndUTC(value);
  }
  from(value: Date): string {
    return toDateString(value);
  }
}
