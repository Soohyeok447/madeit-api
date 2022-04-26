import { Injectable } from '@nestjs/common';
import { ExchangePointResponseDto } from 'src/domain/use-cases/exchange/exchange-point/dtos/ExchangePointResponseDto';
import { ExchangePointUseCase } from 'src/domain/use-cases/exchange/exchange-point/ExchangePointUseCase';
import { IssueExchangeTokenResponseDto } from 'src/domain/use-cases/exchange/issue-exchange-token/dtos/IssueExchangeTokenResponseDto';
import { IssueExchangeTokenUseCase } from 'src/domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCase';
import { RequestSerialResponseDto } from 'src/domain/use-cases/exchange/request-serial/dtos/RequestSerialResponseDto';
import { RequestSerialUseCase } from 'src/domain/use-cases/exchange/request-serial/RequestSerialUseCase';
import { UserPayload } from '../common/decorators/user.decorator';

@Injectable()
export class ExchangeController {
  public constructor(
    private readonly requestSerialUseCase: RequestSerialUseCase,
    private readonly issueExchangeTokenUseCase: IssueExchangeTokenUseCase,
    private readonly exchangePointUseCase: ExchangePointUseCase,
  ) {}

  public async requestSerial(
    user: UserPayload,
    { email }: { email: string },
  ): Promise<RequestSerialResponseDto> {
    return this.requestSerialUseCase.execute({
      userId: user.id,
      email,
    });
  }

  public async issueExchangeToken(
    user: UserPayload,
    { serial }: { serial: string },
  ): Promise<IssueExchangeTokenResponseDto> {
    return this.issueExchangeTokenUseCase.execute({
      userId: user.id,
      serial,
    });
  }

  public async exchangePoint(
    user: UserPayload,
    {
      exchangeToken,
      amount,
      bank,
      account,
    }: {
      exchangeToken: string;
      amount: number;
      bank: string;
      account: string;
    },
  ): Promise<ExchangePointResponseDto> {
    return this.exchangePointUseCase.execute({
      userId: user.id,
      exchangeToken,
      amount,
      bank,
      account,
    });
  }
}
