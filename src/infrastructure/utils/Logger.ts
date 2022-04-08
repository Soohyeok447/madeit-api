import { ConsoleLogger, Inject, Logger as NestLogger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import winston, { Logger as winstonLogger } from 'winston';
import { WinstonModule, utilities } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const transport: DailyRotateFile = new DailyRotateFile({
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
});

// transport.on('rotate', function (oldFilename, newFilename) {
//   // do something fun
// });

// const logger = winston.createLogger({
//   transports: [transport],
// });

// logger.info('Hello World!');

// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     //
//     // - Write all logs with importance level of `error` or less to `error.log`
//     // - Write all logs with importance level of `info` or less to `combined.log`
//     //
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });

// //
// // If we're not in production then log to the `console` with the format:
// // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// //
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

export class Logger extends ConsoleLogger {
  private logger: winstonLogger;

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }
}
