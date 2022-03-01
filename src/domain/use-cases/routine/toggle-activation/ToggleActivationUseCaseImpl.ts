import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { UserModel } from '../../../models/UserModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/service/CommonUserService';
import { ToggleActivationResponse } from '../response.index';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { ToggleActivationUsecaseParams } from './dtos/ToggleActivationUseCaseParams';
import { ToggleActivationUseCase } from './ToggleActivationUseCase';

@Injectable()
export class ToggleActivationUseCaseImpl implements ToggleActivationUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: ToggleActivationUsecaseParams): ToggleActivationResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    await this._toggleActivation(routine, routineId);

    return {};
  }

  private async _toggleActivation(routine: RoutineModel, routineId: string) {
    if (routine['activation']) {
      await this._routineRepository.update(routineId, { activation: false });
    } else {
      await this._routineRepository.update(routineId, { activation: true });
    }
  }
}
