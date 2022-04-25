import { UseCase } from '../../UseCase';
import { ExchangePointResponseDto } from './dtos/ExchangePointResponseDto';
import { ExchangePointUseCaseParams } from './dtos/ExchangePointUseCaseParams';

export abstract class ExchangePointUseCase
  implements
    UseCase<ExchangePointUseCaseParams, Promise<ExchangePointResponseDto>>
{
  public abstract execute(
    params: ExchangePointUseCaseParams,
  ): Promise<ExchangePointResponseDto>;
}
