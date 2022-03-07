import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { UserModel } from '../../../models/UserModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/service/CommonUserService';
import { InactivateRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { InactivateRoutineUseCaseParams } from './dtos/InactivateRoutineUseCaseParams';
import { InactivateRoutineUseCase } from './InactivateRoutineUseCase';
import { RoutineAlreadyInactivatedException } from './exceptions/RoutineAlreadyInactivatedException';

@Injectable()
export class InactivateRoutineUseCaseImpl implements InactivateRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) { }

  public async execute({
    userId,
    routineId,
  }: InactivateRoutineUseCaseParams): InactivateRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    await this._unactivateActivation(routine, routineId);

    return {};
  }

  private async _unactivateActivation(routine: RoutineModel, routineId: string) {
    if (routine['activation']) {
      await this._routineRepository.update(routineId, { activation: false });
    } else {
      throw new RoutineAlreadyInactivatedException();
    }
  }
}
