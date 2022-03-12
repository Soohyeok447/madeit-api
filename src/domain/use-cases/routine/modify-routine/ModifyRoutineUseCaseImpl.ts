import { Injectable } from '@nestjs/common';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { CommonUserService } from '../../user/common/CommonUserService';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserModel } from '../../../models/UserModel';
import { RoutineModel } from '../../../models/RoutineModel';
import { CommonRoutineResponseDto } from '../common/CommonRoutineResponseDto';

@Injectable()
export class ModifyRoutineUseCaseImpl implements ModifyRoutineUseCase {
  constructor(
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
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    CommonRoutineService.assertTimeValidation(hour, minute);

    const updateRoutineDto: UpdateRoutineDto = this._mapParamsToUpdateDto(
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
    );

    const existRoutines: RoutineModel[] =
      await this._routineRepository.findAllByUserId(userId);

    CommonRoutineService.assertAlarmDuplication(
      updateRoutineDto,
      existRoutines,
      routineId,
    );

    const modifiedRoutine: RoutineModel = await this._routineRepository.update(
      routineId,
      updateRoutineDto,
    );

    const output: CommonRoutineResponseDto =
      this._mapModelToResponseDto(modifiedRoutine);

    return output;
  }

  private _mapModelToResponseDto(
    modifiedRoutine: RoutineModel,
  ): CommonRoutineResponseDto {
    return {
      id: modifiedRoutine['_id'],
      title: modifiedRoutine['title'],
      hour: modifiedRoutine['hour'],
      minute: modifiedRoutine['minute'],
      days: modifiedRoutine['days'],
      alarmVideoId: modifiedRoutine['alarm_video_id'],
      contentVideoId: modifiedRoutine['content_video_id'],
      timerDuration: modifiedRoutine['timer_duration'],
      activation: modifiedRoutine['activation'],
      fixedFields: modifiedRoutine['fixed_fields'],
      point: modifiedRoutine['point'],
      exp: modifiedRoutine['exp'],
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
    if (!alarmVideoId) alarmVideoId = null;
    if (!contentVideoId) contentVideoId = null;
    if (!timerDuration) timerDuration = null;

    const sortedDays = CommonRoutineService.sortDays(days);

    return {
      title,
      hour,
      minute,
      days: sortedDays,
      alarm_video_id: alarmVideoId,
      content_video_id: contentVideoId,
      timer_duration: timerDuration,
    };
  }
}
