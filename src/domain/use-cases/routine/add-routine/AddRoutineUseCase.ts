import { UseCase } from '../../UseCase';
import { AddRoutineResponseDto } from './dtos/AddRoutineResponseDto';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';

/**
 * 루틴 추가
 */
export abstract class AddRoutineUseCase
  implements UseCase<AddRoutineUsecaseParams, Promise<AddRoutineResponseDto>>
{
  public abstract execute({
    userId,
    title,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
    recommendedRoutineId,
  }: AddRoutineUsecaseParams): Promise<AddRoutineResponseDto>;
}
