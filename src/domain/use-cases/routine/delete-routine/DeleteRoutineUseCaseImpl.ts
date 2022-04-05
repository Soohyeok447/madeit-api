import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DeleteRoutineResponse } from '../response.index';
import { DeleteRoutineUseCase } from './DeleteRoutineUseCase';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { Routine } from '../../../entities/Routine';

@Injectable()
export class DeleteRoutineUseCaseImpl implements DeleteRoutineUseCase {
  public constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    routineId,
  }: DeleteRoutineUseCaseParams): DeleteRoutineResponse {
    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) throw new RoutineNotFoundException();

    this._routineRepository.delete(routineId);

    return {};
  }
}
