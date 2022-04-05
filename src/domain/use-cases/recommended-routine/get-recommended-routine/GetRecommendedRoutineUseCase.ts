import { UseCase } from '../../UseCase';
import { GetRecommendedRoutineResponse } from '../response.index';
import { GetRecommendedRoutineUseCaseParams } from './dtos/GetRecommendedRoutineUseCaseParams';

export abstract class GetRecommendedRoutineUseCase
  implements
    UseCase<GetRecommendedRoutineUseCaseParams, GetRecommendedRoutineResponse>
{
  public abstract execute({
    recommendedRoutineId,
  }: GetRecommendedRoutineUseCaseParams): GetRecommendedRoutineResponse;
}
