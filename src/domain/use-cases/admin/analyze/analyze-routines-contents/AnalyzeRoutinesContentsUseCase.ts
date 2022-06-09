import { UseCase } from '../../../UseCase';
import { AnalyzeRoutinesContentsResponseDto } from './dtos/AnalyzeRoutinesContentsResponseDto';
import { AnalyzeRoutinesContentsUseCaseParams } from './dtos/AnalyzeRoutinesContentsUseCaseParams';

export abstract class AnalyzeRoutinesContentsUseCase
  implements
    UseCase<
      AnalyzeRoutinesContentsUseCaseParams,
      Promise<AnalyzeRoutinesContentsResponseDto>
    >
{
  public abstract execute(
    params: AnalyzeRoutinesContentsUseCaseParams,
  ): Promise<AnalyzeRoutinesContentsResponseDto>;
}
