import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DeleteRoutineUseCase } from './DeleteRoutineUseCase';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';
import { RoutineNotFoundException } from '../../admin/recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { Routine } from '../../../entities/Routine';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { DeleteRoutineResponseDto } from './dtos/DeleteRoutineResponseDto';

@Injectable()
export class DeleteRoutineUseCaseImpl implements DeleteRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    routineId,
  }: DeleteRoutineUseCaseParams): Promise<DeleteRoutineResponseDto> {
    this._logger.setContext('DeleteRoutine');

    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException(
        this._logger.getContext(),
        `미존재 루틴 삭제 시도.`,
      );
    }

    this._routineRepository.delete(routineId);

    return {};
  }
}
