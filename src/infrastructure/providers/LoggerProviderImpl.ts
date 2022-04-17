/* eslint-disable @typescript-eslint/typedef */
// import { ConsoleLogger, Inject, Logger as NestLogger } from '@nestjs/common';

import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as path from 'path';
import { LoggerProvider } from '../../domain/providers/LoggerProvider';

const logDir = 'logs';

/**
 * format: 'YYYY-MM-DD HH:mm:ss'
 */

// 모든 레벨
const debugTransport = new winston.transports.DailyRotateFile({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.message}`),
  ),
  level: 'debug',
  datePattern: 'YYYY-MM-DD',
  dirname: path.join(logDir, '/all'),
  filename: '%DATE%.all.log',
  zippedArchive: true,
});

const errorTransport = new winston.transports.DailyRotateFile({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.message}`),
  ),
  level: 'error',
  datePattern: 'YYYY-MM-DD',
  dirname: path.join(logDir, '/error'),
  filename: '%DATE%.error.log',
  zippedArchive: true,
});

const infoTransport = new winston.transports.DailyRotateFile({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.message}`),
  ),
  level: 'info',
  datePattern: 'YYYY-MM-DD',
  dirname: path.join(logDir, '/info'),
  filename: '%DATE%.info.log',
  zippedArchive: true,
});

const logger = winston.createLogger({
  transports: [errorTransport, debugTransport, infoTransport],
});

export class LoggerProviderImpl extends LoggerProvider {
  private _context?: string;
  private environment: string;

  public setContext(context: string): void {
    this._context = context;
  }

  public error(message: string): void {
    // console.log('error 로거 실행');

    // if (process.env.NODE_ENV === 'test') return;

    if (!this._context)
      logger.error(`\n[${process.env.NODE_ENV}][error] ${message}`);
    else
      logger.error(
        `\n[${process.env.NODE_ENV}][error]<${this._context}> ${message}`,
      );
  }

  public info(message: string): void {
    // console.log('info 로거 실행');

    // if (process.env.NODE_ENV === 'test') return;

    if (!this._context)
      logger.error(`\n[${process.env.NODE_ENV}][info] ${message}`);
    else
      logger.info(
        `\n[${process.env.NODE_ENV}][info]<${this._context}> ${message}`,
      );
  }

  public getContext(): string {
    return this._context;
  }
}
