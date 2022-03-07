import { UseCase } from '../../UseCase';
import { ToggleActivationResponse } from '../response.index';
import { UnactivateRoutineUseCaseParams } from './dtos/UnactivateRoutineUseCaseParams';

/**
 * 루틴 수정
 * admin Role필요
 */
export abstract class UnactivateRoutineUseCase
  implements UseCase<UnactivateRoutineUseCaseParams, ToggleActivationResponse>
{
  abstract execute({
    userId,
    routineId
  }: UnactivateRoutineUseCaseParams): ToggleActivationResponse;
}
