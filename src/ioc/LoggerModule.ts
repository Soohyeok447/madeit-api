/* eslint-disable @typescript-eslint/typedef */
import { DynamicModule, Global } from '@nestjs/common';
import { LoggerProvider } from '../domain/providers/LoggerProvider';
import { LoggerProviderImpl } from '../infrastructure/providers/LoggerProviderImpl';
import { createLoggerProviders } from './factories/LoggerFactory';

// const loggerFactories: any = createLoggerFactories();

// @Global()
// @Module({
//   imports: [],
//   controllers: [],
//   providers: [
//     { provide: LoggerProvider, useClass: LoggerProviderImpl },
//     ...loggerFactories,
//   ],
//   exports: [
//     { provide: LoggerProvider, useClass: LoggerProviderImpl },
//     ...loggerFactories,
//   ],
// })
// export class LoggerModule {}

// @Module({
//   providers: [
//     {
//       provide: LoggerProvider,
//       useClass: LoggerProviderImpl,
//     },
//   ],
// })
@Global()
export class LoggerModule {
  public static forRoot(): DynamicModule {
    const contextedLoggerProviders = createLoggerProviders();

    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerProvider,
          useClass: LoggerProviderImpl,
        },
        ...contextedLoggerProviders,
      ],
      exports: [
        {
          provide: LoggerProvider,
          useClass: LoggerProviderImpl,
        },
        ...contextedLoggerProviders,
      ],
    };
  }
}
