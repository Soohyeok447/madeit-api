import { UseCase } from '../../../UseCase';
import { AnalyzeUseWayOfRoutinesResponseDto } from './dtos/AnalyzeUseWayOfRoutinesResponseDto';
import { AnalyzeUseWayOfRoutinesUseCaseParams } from './dtos/AnalyzeUseWayOfRoutinesUseCaseParams';

export abstract class AnalyzeUseWayOfRoutinesUseCase
  implements
    UseCase<
      AnalyzeUseWayOfRoutinesUseCaseParams,
      Promise<AnalyzeUseWayOfRoutinesResponseDto>
    >
{
  public abstract execute(
    params: AnalyzeUseWayOfRoutinesUseCaseParams,
  ): Promise<AnalyzeUseWayOfRoutinesResponseDto>;
}
