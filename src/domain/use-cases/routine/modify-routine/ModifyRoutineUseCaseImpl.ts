import { Injectable } from '@nestjs/common';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { RoutineUtils } from '../common/RoutineUtils';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { Routine } from '../../../entities/Routine';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { User } from '../../../entities/User';

@Injectable()
export class ModifyRoutineUseCaseImpl implements ModifyRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
    title,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
  }: ModifyRoutineUsecaseParams): ModifyRoutineResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const existingRoutine: Routine = await this._routineRepository.findOne(
      routineId,
    );

    if (!existingRoutine) throw new RoutineNotFoundException();

    const isHourValidate: boolean = RoutineUtils.validateHour(hour);

    if (!isHourValidate) throw new InvalidTimeException(hour);

    const isMinuteValidate: boolean = RoutineUtils.validateMinute(minute);

    if (!isMinuteValidate) throw new InvalidTimeException(minute);

    const updateRoutineDto: UpdateRoutineDto = this._mapParamsToUpdateDto(
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
    );

    const existRoutines: Routine[] =
      await this._routineRepository.findAllByUserId(userId);

    RoutineUtils.assertAlarmDuplication(
      updateRoutineDto,
      existRoutines,
      routineId,
    );

    const modifiedRoutine: Routine = await this._routineRepository.update(
      routineId,
      {
        title,
        hour,
        minute,
        days,
        alarmVideoId,
        contentVideoId,
        timerDuration,
      },
    );

    return {
      id: modifiedRoutine.id,
      title: modifiedRoutine.title,
      hour: modifiedRoutine.hour,
      minute: modifiedRoutine.minute,
      days: modifiedRoutine.days,
      alarmVideoId: modifiedRoutine.alarmVideoId,
      contentVideoId: modifiedRoutine.contentVideoId,
      timerDuration: modifiedRoutine.timerDuration,
      activation: modifiedRoutine.activation,
      fixedFields: modifiedRoutine.fixedFields,
      point: modifiedRoutine.point,
      exp: modifiedRoutine.exp,
    };
  }

  private _mapParamsToUpdateDto(
    title: string,
    hour: number,
    minute: number,
    days: number[],
    alarmVideoId: string,
    contentVideoId: string,
    timerDuration: number,
  ): UpdateRoutineDto {
    return {
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
    };
  }
}
