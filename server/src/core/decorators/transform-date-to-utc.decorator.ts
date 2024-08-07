// import { toUTCEndOfDay, toUTCStartOfDay } from '@common/utils/date.util';
// import { BadRequestException } from '@nestjs/common';
// import { Transform } from 'class-transformer';
// import dayjs from 'dayjs';

// export type TransformDateOptions = {
//   option: 'start' | 'end';
// };

// export function TransformDateToUTC({ option }: TransformDateOptions): PropertyDecorator {
//   return Transform(({ value }) => {
//     const regex = /^\d{4}-\d{2}-\d{2}$/;
//     if (typeof value !== 'string' && !regex.test(value) && !dayjs(value).isValid()) {
//       throw new BadRequestException(`Please provide only date like 'YYYY-MM-DD'`);
//     }

//     return option === 'start' ? toUTCStartOfDay(value) : toUTCEndOfDay(value);
//   });
// }
