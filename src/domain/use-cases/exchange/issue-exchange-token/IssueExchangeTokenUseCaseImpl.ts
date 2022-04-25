import { HttpException } from 'src/domain/common/exceptions/HttpException';
import { Serial } from 'src/domain/entities/Serial';
import { ExchangeAuthProvider } from 'src/domain/providers/ExchangeAuthProvider';
import { LoggerProvider } from 'src/domain/providers/LoggerProvider';
import { ExchangeTokenRepository } from 'src/domain/repositories/exchange-token/ExchangeTokenRepository';
import { SerialRepository } from 'src/domain/repositories/serial/SerialRepository';
import { IssueExchangeTokenResponseDto } from './dtos/IssueExchangeTokenResponseDto';
import { IssueExchangeTokenUseCaseParams } from './dtos/IssueExchangeTokenUseCaseParams';
import { IssueExchangeTokenUseCase } from './IssueExchangeTokenUseCase';

export class IssueExchangeTokenUseCaseImpl
  implements IssueExchangeTokenUseCase
{
  public constructor(
    private readonly serialRepository: SerialRepository,
    private readonly exchangeTokenRepository: ExchangeTokenRepository,
    private readonly exchangeAuthProvider: ExchangeAuthProvider,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    serial,
  }: IssueExchangeTokenUseCaseParams): Promise<IssueExchangeTokenResponseDto> {
    const entity: Serial = await this.serialRepository.findOneByUserId(userId);

    if (serial !== entity.serial) {
      throw new HttpException(
        '인증번호가 틀립니다.',
        1,
        401,
        this._logger.getContext(),
        '포인트 교환 인증 번호 확인에 실패.',
      );
    }

    await this.serialRepository.deleteOneByUserId(userId);

    const exchangeToken: string = await this.exchangeAuthProvider.issue(userId);

    await this.exchangeTokenRepository.save(userId, exchangeToken);

    return {
      exchangeToken,
    };
  }
}
