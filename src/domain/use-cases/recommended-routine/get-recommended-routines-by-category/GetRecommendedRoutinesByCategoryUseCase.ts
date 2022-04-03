import { UseCase } from '../../UseCase';
import { GetRecommendedRoutinesByCategoryResponse } from '../response.index';
import { GetRecommendedRoutinesByCategoryUseCaseParams } from './dtos/GetRecommendedRoutinesByCategoryUseCaseParams';

export abstract class GetRecommendedRoutinesByCategoryUseCase
  implements
    UseCase<
      GetRecommendedRoutinesByCategoryUseCaseParams,
      GetRecommendedRoutinesByCategoryResponse
    >
{
  public abstract execute({
    category,
    next,
    size,
  }: GetRecommendedRoutinesByCategoryUseCaseParams): GetRecommendedRoutinesByCategoryResponse;
}
