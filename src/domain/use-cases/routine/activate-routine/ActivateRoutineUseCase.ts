import { UseCase } from '../../UseCase';
import { ActivateRoutineResponse } from '../response.index';
import { ActivateRoutineUseCaseParams } from './dtos/ActivateRoutineUseCaseParams';

/**
 * 알람 활성화
 */
export abstract class ActivateRoutineUseCase
  implements UseCase<ActivateRoutineUseCaseParams, ActivateRoutineResponse>
{
  abstract execute({
    userId,
    routineId,
  }: ActivateRoutineUseCaseParams): ActivateRoutineResponse;
}
