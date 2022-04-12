import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { ActivateRoutineResponse } from '../response.index';
import { ActivateRoutineUseCaseParams } from './dtos/ActivateRoutineUseCaseParams';
import { ActivateRoutineUseCase } from './ActivateRoutineUseCase';
import { RoutineAlreadyActivatedException } from './exceptions/RoutineAlreadyActivatedException';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';
import { User } from '../../../entities/User';
import { Routine } from '../../../entities/Routine';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class ActivateRoutineUseCaseImpl implements ActivateRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    routineId,
  }: ActivateRoutineUseCaseParams): ActivateRoutineResponse {
    this._logger.setContext('ActivateRoutine');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(
        `미가입 유저가 루틴 활성화 API 호출. 호출자 id - ${userId}`,
      );

      throw new UserNotFoundException();
    }

    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      this._logger.error(`미존재 루틴 활성화 시도. 호출자 id - ${userId}`);

      throw new RoutineNotFoundException();
    }

    if (routine.activation) {
      this._logger.error(
        `이미 활성화된 루틴에다가 활성화 API 호출. 호출자 id - ${userId}`,
      );

      throw new RoutineAlreadyActivatedException();
    }

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
