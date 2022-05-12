import { UseCase } from '../../UseCase';
import { AddRecommendedRoutineResponse } from '../response.index';
import { AddRecommendedRoutineUseCaseParams } from './dtos/AddRecommendedRoutineUseCaseParams';

export abstract class AddRecommendedRoutineUseCase
  implements
    UseCase<AddRecommendedRoutineUseCaseParams, AddRecommendedRoutineResponse>
{
  public abstract execute({
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
    point,
    exp,
    accessToken,
  }: AddRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse;
}
