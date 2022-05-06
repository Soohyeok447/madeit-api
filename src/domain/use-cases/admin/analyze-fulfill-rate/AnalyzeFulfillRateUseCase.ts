import { UseCase } from '../../UseCase';
import { AnalyzeFulfillRateResponseDto } from './dtos/AnalyzeFulfillRateResponseDto';
import { AnalyzeFulfillRateUseCaseParams } from './dtos/AnalyzeFulfillRateUseCaseParams';

export abstract class AnalyzeFulfillRateUseCase
  implements
    UseCase<
      AnalyzeFulfillRateUseCaseParams,
      Promise<AnalyzeFulfillRateResponseDto>
    >
{
  public abstract execute(
    params: AnalyzeFulfillRateUseCaseParams,
  ): Promise<AnalyzeFulfillRateResponseDto>;
}
