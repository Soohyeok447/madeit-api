import { UseCase } from '../../UseCase';
import { IssueExchangeTokenResponseDto } from './dtos/IssueExchangeTokenResponseDto';
import { IssueExchangeTokenUseCaseParams } from './dtos/IssueExchangeTokenUseCaseParams';

export abstract class IssueExchangeTokenUseCase
  implements
    UseCase<
      IssueExchangeTokenUseCaseParams,
      Promise<IssueExchangeTokenResponseDto>
    >
{
  public abstract execute(
    params: IssueExchangeTokenUseCaseParams,
  ): Promise<IssueExchangeTokenResponseDto>;
}
