import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DoneRoutineResponse } from '../response.index';
import { DoneRoutineUseCase } from './DoneRoutineUseCase';
import { DoneRoutineUseCaseParams } from './dtos/DoneRoutineUseCaseParams';
import { CommonUserService } from '../../user/common/CommonUserService';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { UserModel } from '../../../models/UserModel';
import { LevelProvider } from '../../../providers/LevelProvider';
import { Level } from '../../../common/enums/Level';

@Injectable()
export class DoneRoutineUseCaseImpl implements DoneRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _levelProvider: LevelProvider,
  ) {}

  public async execute({
    userId,
    routineId,
  }: DoneRoutineUseCaseParams): DoneRoutineResponse {
    const existingUser: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(existingUser);

    const existingRoutine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(existingRoutine);

    const point: number = existingUser['point'] + existingRoutine['point'];

    const exp: number = existingUser['exp'] + existingRoutine['exp'];

    const didRoutinesInTotal: number =
      existingUser['did_routines_in_total'] + 1;

    const didRoutinesInMonth: number =
      existingUser['did_routines_in_month'] + 1;

    const level: Level = this._levelProvider.calculateLevel(exp);

    await this._userRepository.update(userId, {
      point,
      exp,
      did_routines_in_total: didRoutinesInTotal,
      did_routines_in_month: didRoutinesInMonth,
      level,
    });

    return {};
  }
}
