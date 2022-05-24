import { UseCase } from '../../UseCase';
import { ModifyRecommendedRoutineResponseDto } from './dtos/ModifyRecommendedRoutineResponseDto';
import { ModifyRecommendedRoutineUseCaseParams } from './dtos/ModifyRecommendedRoutineUseCaseParams';

export abstract class ModifyRecommendedRoutineUseCase
  implements
    UseCase<
      ModifyRecommendedRoutineUseCaseParams,
      Promise<ModifyRecommendedRoutineResponseDto>
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
  }: ModifyRecommendedRoutineUseCaseParams): Promise<ModifyRecommendedRoutineResponseDto>;
}
