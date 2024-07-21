import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = 'Asia/Seoul';

/**
 * 주어진 날짜 문자열을 UTC 기준의 시작 시간(00:00:00)으로 변환
 * @param dateString 'YYYY-MM-DD' 형식의 날짜 문자열
 * @returns UTC 기준의 시작 시간
 */
export const toUTCStartOfDay = (dateString: string): Date => {
  return dayjs.tz(dateString, DEFAULT_TIMEZONE).startOf('day').utc().toDate();
};

/**
 * 주어진 날짜 문자열을 UTC 기준의 종료 시간(23:59:59.999)으로 변환
 * @param dateString 'YYYY-MM-DD' 형식의 날짜 문자열
 * @returns UTC 기준의 종료 시간
 */
export const toUTCEndOfDay = (dateString: string): Date => {
  return dayjs.tz(dateString, DEFAULT_TIMEZONE).endOf('day').utc().toDate();
};

export const getUTCMidnightFromKRTime = (): Date => {
  const koreanMidnight = dayjs().tz(DEFAULT_TIMEZONE).startOf('day');
  return koreanMidnight.utc().toDate();
};
