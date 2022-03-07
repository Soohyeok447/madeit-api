import { Injectable } from '@nestjs/common';
import { UpdateRoutineDto } from '../../../repositories/routine/dtos/UpdateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { ModifyRoutineResponse } from '../response.index';
import { ModifyRoutineResponseDto } from './dtos/ModifyRoutineResponseDto';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { CommonUserService } from '../../user/service/CommonUserService';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserModel } from '../../../models/UserModel';
import { RoutineModel } from '../../../models/RoutineModel';

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

    const newRoutine: RoutineModel = await this._routineRepository.update(
      routineId,
      updateRoutineDto,
    );

    const output: ModifyRoutineResponseDto =
      this._mapModelToResponseDto(newRoutine);

    return output;
  }

  private _mapModelToResponseDto(
    newRoutine: RoutineModel,
  ): ModifyRoutineResponseDto {
    return {
      id: newRoutine['_id'],
      title: newRoutine['title'],
      hour: newRoutine['hour'],
      minute: newRoutine['minute'],
      days: newRoutine['days'],
      alarmVideoId: newRoutine['alarm_video_id'],
      contentVideoId: newRoutine['content_video_id'],
      timerDuration: newRoutine['timer_duration'],
      activation: newRoutine['activation'],
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
