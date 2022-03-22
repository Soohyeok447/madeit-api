import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { InactivateRoutineResponse } from '../response.index';
import { InactivateRoutineUseCaseParams } from './dtos/InactivateRoutineUseCaseParams';
import { InactivateRoutineUseCase } from './InactivateRoutineUseCase';
import { RoutineAlreadyInactivatedException } from './exceptions/RoutineAlreadyInactivatedException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';

@Injectable()
export class InactivateRoutineUseCaseImpl implements InactivateRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: InactivateRoutineUseCaseParams): InactivateRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const routine = await this._routineRepository.findOne(routineId);

    if (!routine) throw new RoutineNotFoundException();

    if (!routine.activation) throw new RoutineAlreadyInactivatedException();

    await this._routineRepository.update(routineId, { activation: false });

    return {
      id: routine.id,
      title: routine.title,
      hour: routine.hour,
      minute: routine.minute,
      days: routine.days,
      alarmVideoId: routine.alarmVideoId,
      contentVideoId: routine.contentVideoId,
      timerDuration: routine.timerDuration,
      activation: !routine.activation,
      fixedFields: routine.fixedFields,
      point: routine.point,
      exp: routine.exp,
    };
  }
}
