import { Injectable } from '@nestjs/common';
import { ExchangePointResponseDto } from 'src/domain/use-cases/exchange/exchange-point/dtos/ExchangePointResponseDto';
import { ExchangePointUseCase } from 'src/domain/use-cases/exchange/exchange-point/ExchangePointUseCase';
import { IssueExchangeTokenResponseDto } from 'src/domain/use-cases/exchange/issue-exchange-token/dtos/IssueExchangeTokenResponseDto';
import { IssueExchangeTokenUseCase } from 'src/domain/use-cases/exchange/issue-exchange-token/IssueExchangeTokenUseCase';
import { RequestSerialResponseDto } from 'src/domain/use-cases/exchange/request-serial/dtos/RequestSerialResponseDto';
import { RequestSerialUseCase } from '../../domain/use-cases/exchange/request-serial/RequestSerialUseCase';
import { UserPayload } from '../common/decorators/user.decorator';
import { ExchangePointRequestDto } from './exchange-point/ExchangePointRequestDto';
import { IssueExchangeTokenRequestDto } from './issue-exchange-token/IssueExchangeTokenRequestDto';
import { RequestSerialRequestDto } from './request-serial/RequestSerialRequestDto';

@Injectable()
export class ExchangeController {
  public constructor(
    private readonly requestSerialUseCase: RequestSerialUseCase,
    private readonly issueExchangeTokenUseCase: IssueExchangeTokenUseCase,
    private readonly exchangePointUseCase: ExchangePointUseCase,
  ) {}

  public async requestSerial(
    user: UserPayload,
    { email }: RequestSerialRequestDto,
  ): Promise<RequestSerialResponseDto> {
    return this.requestSerialUseCase.execute({
      userId: user.id,
      email,
    });
  }

  public async issueExchangeToken(
    user: UserPayload,
    { serial }: IssueExchangeTokenRequestDto,
  ): Promise<IssueExchangeTokenResponseDto> {
    return this.issueExchangeTokenUseCase.execute({
      userId: user.id,
      serial,
    });
  }

  public async exchangePoint(
    headers: any,
    user: UserPayload,
    { amount, bank, account }: ExchangePointRequestDto,
  ): Promise<ExchangePointResponseDto> {
    const exchangeToken: string = headers.authorization.split(' ')[1];

    return this.exchangePointUseCase.execute({
      userId: user.id,
      exchangeToken,
      amount,
      bank,
      account,
    });
  }
}
