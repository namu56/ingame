import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DEFAULT_TIMEZONE = 'Asia/Seoul';

/**
 * 주어진 날짜 문자열을 UTC 기준의 시작 시간(00:00:00)으로 변환
 * @param dateString 'YYYY-MM-DD' 형식의 날짜 문자열
 * @returns UTC 기준의 시작 시간
 */
export const toStartUTC = (dateString: string): Date => {
  return dayjs.tz(dateString, DEFAULT_TIMEZONE).startOf('day').utc().toDate();
};

/**
 * 주어진 날짜 문자열을 UTC 기준의 종료 시간(23:59:59.999)으로 변환
 * @param dateString 'YYYY-MM-DD' 형식의 날짜 문자열
 * @returns UTC 기준의 종료 시간
 */
export const toEndUTC = (dateString: string): Date => {
  return dayjs.tz(dateString, DEFAULT_TIMEZONE).endOf('day').utc().toDate();
};

export const toDateString = (date: Date): string => {
  return dayjs(date).tz(DEFAULT_TIMEZONE).format('YYYY-MM-DD');
};

export const getExpiredDate = (): Date => {
  return dayjs().tz(DEFAULT_TIMEZONE).startOf('day').utc().toDate();
};

export const getAsiaTime = (): Date => {
  return dayjs().tz(DEFAULT_TIMEZONE).toDate();
};
