/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Provider } from '@nestjs/common';
import { contextForLoggers } from '../../domain/common/decorators/LoggerDecorator';
import { LoggerProvider } from '../../domain/providers/LoggerProvider';

function loggerFactory(
  logger: LoggerProvider,
  context: string,
): LoggerProvider {
  if (context) logger.setContext(context);

  return logger;
}

function createLoggerProvider(context: string): Provider<LoggerProvider> {
  return {
    provide: `${context}`,
    useFactory: (logger): any => loggerFactory(logger, context),
    inject: [LoggerProvider],
  };
}

export function createLoggerProviders(): Provider<LoggerProvider>[] {
  return contextForLoggers.map((context) => createLoggerProvider(context));
}
