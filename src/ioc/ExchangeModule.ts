import { Module } from '@nestjs/common';
import { RequestSerialUseCase } from 'src/domain/use-cases/exchange/request-serial/RequestSerialUseCase';
import { RequestSerialUseCaseImpl } from 'src/domain/use-cases/exchange/request-serial/RequestSerialUseCaseImpl';
import { ExchangePointUseCase } from '../domain/use-cases/exchange/exchange-point/ExchangePointUseCase';
import { ExchangePointUseCaseImpl } from '../domain/use-cases/exchange/exchange-point/ExchangePointUseCaseImpl';
import { IssueExchangeTokenUseCase } from '../domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCase';
import { IssueExchangeTokenUseCaseImpl } from '../domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCaseImpl';
import { ExchangeControllerInjectedDecorator } from './controllers/exchange/ExchangeControllerInjectedDecorator';

@Module({
  providers: [
    {
      provide: RequestSerialUseCase,
      useClass: RequestSerialUseCaseImpl,
    },
    {
      provide: IssueExchangeTokenUseCase,
      useClass: IssueExchangeTokenUseCaseImpl,
    },
    {
      provide: ExchangePointUseCase,
      useClass: ExchangePointUseCaseImpl,
    },
  ],
  controllers: [ExchangeControllerInjectedDecorator],
})
export class ExchangeModule {}
