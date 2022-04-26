import { Body, Controller, Post } from '@nestjs/common';
import {
  UserAuth,
  UserPayload,
} from 'src/adapter/common/decorators/user.decorator';
import { ExchangeController } from 'src/adapter/exchange/ExchangeController';
import { ExchangePointResponseDto } from 'src/domain/use-cases/exchange/exchange-point/dtos/ExchangePointResponseDto';
import { IssueExchangeTokenResponseDto } from 'src/domain/use-cases/exchange/issue-exchange-token/dtos/IssueExchangeTokenResponseDto';
import { RequestSerialResponseDto } from 'src/domain/use-cases/exchange/request-serial/dtos/RequestSerialResponseDto';

@Controller('v1/exchange')
export class ExchangeControllerInjectedDecorator extends ExchangeController {
  @Post('serial')
  public requestSerial(
    @UserAuth() user: UserPayload,
    @Body() body: { email: string },
  ): Promise<RequestSerialResponseDto> {
    return super.requestSerial(user, body);
  }

  @Post('auth')
  public issueExchangeToken(
    @UserAuth() user: UserPayload,
    @Body() body: { serial: string },
  ): Promise<IssueExchangeTokenResponseDto> {
    return super.issueExchangeToken(user, body);
  }

  @Post()
  public exchangePoint(
    @UserAuth() user: UserPayload,
    @Body()
    body: {
      exchangeToken: string;
      amount: number;
      bank: string;
      account: string;
    },
  ): Promise<ExchangePointResponseDto> {
    return super.exchangePoint(user, body);
  }
}
