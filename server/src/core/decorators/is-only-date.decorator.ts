import { ValidationOptions, registerDecorator } from 'class-validator';
import dayjs from 'dayjs';

const DATE_REGEX = /^\d{4}(-)((0[1-9])|(1[0-2]))(-)([12]\d|3[0-1])$/;

export function IsOnlyDate(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsOnlyDate',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Please provide only date like YYYY-MM-DD',
        ...validationOptions,
      },
      validator: {
        validate(value: any): boolean {
          if (typeof value !== 'string' && !DATE_REGEX.test(value)) return false;

          return dayjs(value, 'YYYY-MM-DD', true).isValid();
        },
      },
    });
  };
}
