import { UseCase } from '../../UseCase';
import { InactivateRoutineResponse, ToggleActivationResponse } from '../response.index';
import { InactivateRoutineUseCaseParams } from './dtos/InactivateRoutineUseCaseParams';

/**
 * 알람 비활성화
 */
export abstract class InactivateRoutineUseCase
  implements UseCase<InactivateRoutineUseCaseParams, InactivateRoutineResponse>
{
  abstract execute({
    userId,
    routineId
  }: InactivateRoutineUseCaseParams): InactivateRoutineResponse;
}
