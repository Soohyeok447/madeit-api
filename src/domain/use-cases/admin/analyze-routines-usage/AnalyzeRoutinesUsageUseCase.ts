import { UseCase } from '../../UseCase';
import { AnalyzeRoutinesUsageResponseDto } from './dtos/AnalyzeRoutinesUsageResponseDto';
import { AnalyzeRoutinesUsageUseCaseParams } from './dtos/AnalyzeRoutinesUsageUseCaseParams';

export abstract class AnalyzeRoutinesUsageUseCase
  implements
    UseCase<
      AnalyzeRoutinesUsageUseCaseParams,
      Promise<AnalyzeRoutinesUsageResponseDto[]>
    >
{
  public abstract execute(
    params: AnalyzeRoutinesUsageUseCaseParams,
  ): Promise<AnalyzeRoutinesUsageResponseDto[]>;
}
