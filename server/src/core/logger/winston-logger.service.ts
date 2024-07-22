import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { Injectable, LoggerService } from '@nestjs/common';
import winstonCloudWatch from 'winston-cloudwatch';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private configService: ConfigService) {
    const isProduction = process.env.NODE_ENV === 'production';
    const logDir = __dirname + '/../../logs';
    const { combine, timestamp, ms, simple } = winston.format;
    const { nestLike } = nestWinstonModuleUtilities.format;

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

    const cloudWatchConfig = {
      logGroupName: 'InGame-Logs',
      logStreamName: 'ingame-logger',
      awsRegion: this.configService.get<string>('AWS_REGION'),
      awsAccessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      awsSecretKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      jsonMessage: true,
    };

    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: isProduction ? 'info' : 'silly',
          format: isProduction
            ? simple()
            : combine(
                timestamp(),
                ms(),
                nestLike('InGame', {
                  colors: true,
                  prettyPrint: true,
                })
              ),
        }),
        new winstonDaily(dailyOptions('info')),
        new winstonDaily(dailyOptions('warn')),
        new winstonDaily(dailyOptions('error')),
      ],
    });
    if (isProduction) {
      this.logger.add(new winstonCloudWatch(cloudWatchConfig));
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }
}
