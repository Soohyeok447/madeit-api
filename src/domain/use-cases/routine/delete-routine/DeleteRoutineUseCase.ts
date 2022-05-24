import { UseCase } from '../../UseCase';
import { DeleteRoutineResponseDto } from './dtos/DeleteRoutineResponseDto';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';

/**
 * 루틴 삭제
 */
export abstract class DeleteRoutineUseCase
  implements
    UseCase<DeleteRoutineUseCaseParams, Promise<DeleteRoutineResponseDto>>
{
  public abstract execute(
    params: DeleteRoutineUseCaseParams,
  ): Promise<DeleteRoutineResponseDto>;
}
