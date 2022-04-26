import { Module } from '@nestjs/common';
import { RequestSerialUseCase } from 'src/domain/use-cases/exchange/request-serial/RequestSerialUseCase';
import { RequestSerialUseCaseImpl } from 'src/domain/use-cases/exchange/request-serial/RequestSerialUseCaseImpl';
import { ExchangeControllerInjectedDecorator } from './controllers/exchange/ExchangeControllerInjectedDecorator';

@Module({
  providers: [
    {
      provide: RequestSerialUseCase,
      useClass: RequestSerialUseCaseImpl,
    },
  ],
  controllers: [ExchangeControllerInjectedDecorator],
})
export class ExchangeModule {}
