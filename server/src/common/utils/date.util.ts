import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const toUTCTimestamp = (date: string): number => {
  const now = dayjs.utc();

  return dayjs
    .utc(date)
    .hour(now.hour())
    .minute(now.minute())
    .second(now.second())
    .millisecond(now.millisecond())
    .valueOf();
};
