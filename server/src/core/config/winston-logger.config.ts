import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const isProduction = process.env.NODE_ENV === 'production';
const logDir = __dirname + '../../logs';
const { combine, timestamp, ms, simple } = winston.format;
const { nestLike } = utilities.format;

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxsize: '20m',
    maxFiles: '14d',
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? simple()
        : combine(timestamp(), ms(), nestLike('InGame', { colors: true, prettyPrint: true })),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
