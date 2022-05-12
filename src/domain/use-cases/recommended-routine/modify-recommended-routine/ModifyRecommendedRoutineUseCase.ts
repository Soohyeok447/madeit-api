import { UseCase } from '../../UseCase';
import { ModifyRecommendedRoutineResponse } from '../response.index';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';

export abstract class ModifyRecommendedRoutineUseCase
  implements
    UseCase<
      ModifyRecommendedRoutineUseCaseParams,
      ModifyRecommendedRoutineResponse
    >
{
  public abstract execute({
    recommendedRoutineId,
    title,
    category,
    introduction,
    fixedFields,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
    price,
    accessToken,
  }: ModifyRecommendedRoutineUseCaseParams): ModifyRecommendedRoutineResponse;
}
