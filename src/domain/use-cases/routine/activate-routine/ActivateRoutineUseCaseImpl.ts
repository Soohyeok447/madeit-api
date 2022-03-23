import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ActivateRoutineResponse } from '../response.index';
import { ActivateRoutineUseCaseParams } from './dtos/ActivateRoutineUseCaseParams';
import { ActivateRoutineUseCase } from './ActivateRoutineUseCase';
import { RoutineAlreadyActivatedException } from './exceptions/RoutineAlreadyActivatedException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';

@Injectable()
export class ActivateRoutineUseCaseImpl implements ActivateRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: ActivateRoutineUseCaseParams): ActivateRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const routine = await this._routineRepository.findOne(routineId);

    if (!routine) throw new RoutineNotFoundException();

    if (routine.activation) throw new RoutineAlreadyActivatedException();

    await this._routineRepository.update(routineId, { activation: true });

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
