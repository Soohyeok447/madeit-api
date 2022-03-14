import { UseCase } from '../../UseCase';
import { AddRecommendedRoutineResponse } from '../response.index';
import { AddRecommendedRoutineUseCaseParams } from './dtos/AddRecommendedRoutineUseCaseParams';

export abstract class AddRecommendedRoutineUseCase
  implements
    UseCase<AddRecommendedRoutineUseCaseParams, AddRecommendedRoutineResponse>
{
  abstract execute({
    userId,
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
  }: AddRecommendedRoutineUseCaseParams): AddRecommendedRoutineResponse;
}
