import { UseCase } from '../../UseCase';
import { DeleteRoutineResponse } from '../response.index';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';

/**
 * 루틴 삭제
 */
export abstract class DeleteRoutineUseCase
  implements UseCase<DeleteRoutineUseCaseParams, DeleteRoutineResponse>
{
  abstract execute(
    params: DeleteRoutineUseCaseParams,
  ): DeleteRoutineResponse;
}
