import { UseCase } from '../../UseCase';
import { DeleteRecommendedRoutineResponse } from '../response.index';
import { DeleteRecommendedRoutineUseCaseParams } from './dtos/DeleteRecommendedRoutineUseCaseParams';

export abstract class DeleteRecommendedRoutineUseCase
  implements
    UseCase<
      DeleteRecommendedRoutineUseCaseParams,
      DeleteRecommendedRoutineResponse
    >
{
  public abstract execute({
    recommendedRoutineId,
    accessToken,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse;
}
