import { UseCase } from '../../UseCase';
import { ToggleActivationResponse } from '../response.index';
import { ActivateRoutineUseCaseParams } from './dtos/ActivateRoutineUseCaseParams';

/**
 * 루틴 수정
 * admin Role필요
 */
export abstract class ActivateRoutineUseCase
  implements UseCase<ActivateRoutineUseCaseParams, ToggleActivationResponse>
{
  abstract execute({
    userId,
    routineId
  }: ActivateRoutineUseCaseParams): ToggleActivationResponse;
}
