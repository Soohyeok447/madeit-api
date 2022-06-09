import { UseCase } from '../../../UseCase';
import { DeleteRecommendedRoutineResponseDto } from './dtos/DeleteRecommendedRoutineResponseDto';
import { DeleteRecommendedRoutineUseCaseParams } from './dtos/DeleteRecommendedRoutineUseCaseParams';

export abstract class DeleteRecommendedRoutineUseCase
  implements
    UseCase<
      DeleteRecommendedRoutineUseCaseParams,
      Promise<DeleteRecommendedRoutineResponseDto>
    >
{
  public abstract execute({
    recommendedRoutineId,
    accessToken,
  }: DeleteRecommendedRoutineUseCaseParams): Promise<DeleteRecommendedRoutineResponseDto>;
}
