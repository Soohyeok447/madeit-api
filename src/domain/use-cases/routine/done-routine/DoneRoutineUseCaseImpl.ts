import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DoneRoutineResponse } from '../response.index';
import { DoneRoutineUseCase } from './DoneRoutineUseCase';
import { DoneRoutineUseCaseParams } from './dtos/DoneRoutineUseCaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from './exceptions/RecommendedRoutineNotFoundException';

@Injectable()
export class DoneRoutineUseCaseImpl implements DoneRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _recommendedRepository: RecommendedRoutineRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: DoneRoutineUseCaseParams): DoneRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const existingRoutine = await this._routineRepository.findOne(routineId);

    if (!existingRoutine) throw new RoutineNotFoundException();

    const recommendedRoutine = await this._recommendedRepository.findOne(
      existingRoutine.recommendedRoutineId,
    );

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    const point = user.point + recommendedRoutine.point;

    const exp = user.exp + recommendedRoutine.exp;

    const didRoutinesInTotal = user.didRoutinesInTotal + 1;

    const didRoutinesInMonth = user.didRoutinesInMonth + 1;

    user.setLevel(exp);

    const level = user.level;

    await this._userRepository.update(userId, {
      point,
      exp,
      didRoutinesInTotal,
      didRoutinesInMonth,
      level,
    });

    return {};
  }
}
