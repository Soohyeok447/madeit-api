import { UseCase } from '../../UseCase';
import { ModifyRoutineResponseDto } from './dtos/ModifyRoutineResponseDto';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';

/**
 * 루틴 수정
 */
export abstract class ModifyRoutineUseCase
  implements
    UseCase<ModifyRoutineUsecaseParams, Promise<ModifyRoutineResponseDto>>
{
  public abstract execute(
    params: ModifyRoutineUsecaseParams,
  ): Promise<ModifyRoutineResponseDto>;
}
