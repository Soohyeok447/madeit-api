import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserAuth,
  UserPayload,
} from 'src/adapter/common/decorators/user.decorator';
import { ExchangeController } from 'src/adapter/exchange/ExchangeController';
import { ExchangePointResponseDto } from 'src/domain/use-cases/exchange/exchange-point/dtos/ExchangePointResponseDto';
import { IssueExchangeTokenResponseDto } from 'src/domain/use-cases/exchange/issue-exchange-token/dtos/IssueExchangeTokenResponseDto';
import { RequestSerialResponseDto } from 'src/domain/use-cases/exchange/request-serial/dtos/RequestSerialResponseDto';
import { ExchangeAuthGuard } from '../../../adapter/common/guards/ExchangeAuthGuard.guard';
import { JwtAuthGuard } from '../../../adapter/common/guards/JwtAuthGuard.guard';
import { ExchangePointRequestDto } from '../../../adapter/exchange/exchange-point/ExchangePointRequestDto';
import { IssueExchangeTokenRequestDto } from '../../../adapter/exchange/issue-exchange-token/IssueExchangeTokenRequestDto';
import { RequestSerialRequestDto } from '../../../adapter/exchange/request-serial/RequestSerialRequestDto';

@ApiTags('포인트 환급 API')
@Controller('v1/exchange')
export class ExchangeControllerInjectedDecorator extends ExchangeController {
  @ApiOperation({
    summary: '포인트 환전토큰 발급용 시리얼넘버 발급 API',
    description: `
    시리얼이 저장된 객체는 30분이 지나면 DB에서 자동 삭제됩니다. 

    [Request body]
    - REQUIRED - 
    String email

    - OPTIONAL -
   
    [Response]
    201

    [에러코드]
    `,
  })
  @ApiBody({
    description: `
    시리얼넘버 발급을 위한 이메일`,
    type: RequestSerialRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    시리얼넘버가 적힌 이메일 발송 성공`,
    type: Object,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('serial')
  public requestSerial(
    @UserAuth() user: UserPayload,
    @Body() body: RequestSerialRequestDto,
  ): Promise<RequestSerialResponseDto> {
    return super.requestSerial(user, body);
  }

  @ApiOperation({
    summary: '포인트 환전토큰 발급 API',
    description: `
    발급된 환전토큰은 5분이 지나면 DB에서 자동 삭제됩니다. 

    [Request body]
    - REQUIRED - 
    String serial

    - OPTIONAL -
   
    [Response]
    201, 401

    [에러코드]
    1 - DB에 인증정보가 담긴 객체가 없음
    2 - 인증번호가 틀림
    `,
  })
  @ApiBody({
    description: `
    환급토큰을 발급받기 위한 시리얼 넘버`,
    type: IssueExchangeTokenRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    환급토큰 발급 성공`,
    type: IssueExchangeTokenResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(JwtAuthGuard)
  @Post('auth')
  public issueExchangeToken(
    @UserAuth() user: UserPayload,
    @Body() body: IssueExchangeTokenRequestDto,
  ): Promise<IssueExchangeTokenResponseDto> {
    return super.issueExchangeToken(user, body);
  }

  @ApiOperation({
    summary: '포인트 환급요청 API',
    description: `
    헤더에 Bearer Token값으로 환급토큰이 와야합니다.

    유효한 요청일 경우에 Order객체를 생성 후 DB에 저장합니다.

    [Request body]
    - REQUIRED - 
    String bank
    String account
    Int amount

    - OPTIONAL -
   
    [Response]
    201, 401, 403, 404

    [에러코드]
    1 - 포인트 환급토큰객체가 DB에 없음
    2 - 유효하지 않은 포인트 환급토큰
    3 - 만료된 포인트 환급토큰
    4 - 이용자를 찾지 못함
    5 - 포인트 부족
    `,
  })
  @ApiBody({
    description: `
    환급토큰을 발급받기 위한 시리얼 넘버`,
    type: ExchangePointRequestDto,
  })
  @ApiResponse({
    status: 201,
    description: `
    환급토큰 발급 성공`,
    type: ExchangePointResponseDto,
  })
  @ApiBearerAuth('JWT')
  @UseGuards(ExchangeAuthGuard)
  @Post()
  public exchangePoint(
    @Headers() headers: any,
    @UserAuth() user: UserPayload,
    @Body() body: ExchangePointRequestDto,
  ): Promise<ExchangePointResponseDto> {
    return super.exchangePoint(headers, user, body);
  }
}
