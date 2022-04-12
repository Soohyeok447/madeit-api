import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DeleteRoutineResponse } from '../response.index';
import { DeleteRoutineUseCase } from './DeleteRoutineUseCase';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { Routine } from '../../../entities/Routine';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class DeleteRoutineUseCaseImpl implements DeleteRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    routineId,
    userId,
  }: DeleteRoutineUseCaseParams): DeleteRoutineResponse {
    this._logger.setContext('DeleteRoutine');

    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      this._logger.error(`미존재 루틴 삭제 시도. 호출자 id - ${userId}`);

      throw new RoutineNotFoundException();
    }

    this._routineRepository.delete(routineId);

    return {};
  }
}
