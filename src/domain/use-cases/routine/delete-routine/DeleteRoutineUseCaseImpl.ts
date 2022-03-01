import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DeleteRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { DeleteRoutineUseCase } from './DeleteRoutineUseCase';
import { DeleteRoutineUseCaseParams } from './dtos/DeleteRoutineUseCaseparams';

@Injectable()
export class DeleteRoutineUseCaseImpl implements DeleteRoutineUseCase {
  constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    routineId,
  }: DeleteRoutineUseCaseParams): DeleteRoutineResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    this._routineRepository.delete(routineId);
  }
}
