import { UseCase } from '../../UseCase';
import { DoneRoutineResponse } from '../response.index';
import { DoneRoutineUseCaseParams } from './dtos/DoneRoutineUseCaseParams';

/**
 * 루틴 완료
 */
export abstract class DoneRoutineUseCase
  implements UseCase<DoneRoutineUseCaseParams, DoneRoutineResponse>
{
  public abstract execute({
    userId,
    routineId,
  }: DoneRoutineUseCaseParams): DoneRoutineResponse;
}
