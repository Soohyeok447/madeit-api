import { UseCase } from '../../UseCase';
import { ToggleActivationResponse } from '../response.index';
import { InactivateRoutineUseCaseParams } from './dtos/InactivateRoutineUseCaseParams';

/**
 * 루틴 수정
 * admin Role필요
 */
export abstract class InactivateRoutineUseCase
  implements UseCase<InactivateRoutineUseCaseParams, ToggleActivationResponse>
{
  abstract execute({
    userId,
    routineId
  }: InactivateRoutineUseCaseParams): ToggleActivationResponse;
}
