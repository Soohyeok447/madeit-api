import { UseCase } from '../../UseCase';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';

/**
 * 루틴 수정
 */
export abstract class ModifyRoutineUseCase
  implements UseCase<ModifyRoutineUsecaseParams, ModifyRoutineResponse>
{
  abstract execute(params: ModifyRoutineUsecaseParams): ModifyRoutineResponse;
}
