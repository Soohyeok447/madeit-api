import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../../domain/models/RoutineModel';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUseCase } from './AddRoutineUseCase';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';
import { CommonUserService } from '../../user/common/CommonUserService';
import { AddRoutineResponseDto } from './dtos/AddRoutineResponseDto';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { UserModel } from '../../../models/UserModel';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    title,
    hour,
    minute,
    days,
    alarmVideoId,
    contentVideoId,
    timerDuration,
  }: AddRoutineUsecaseParams): AddRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    CommonRoutineService.assertTimeValidation(hour, minute);

    const createRoutineDto: CreateRoutineDto = this._mapParamsToCreateDto(
      userId,
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
      createRoutineDto,
      existRoutines,
    );

    const newRoutine: RoutineModel = await this._routineRepository.create(
      createRoutineDto,
    );

    const output: AddRoutineResponseDto =
      this._mapModelToResponseDto(newRoutine);

    return output;
  }

  private _mapModelToResponseDto(
    newRoutine: RoutineModel,
  ): AddRoutineResponseDto {
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

  private _mapParamsToCreateDto(
    userId: string,
    title: string,
    hour: number,
    minute: number,
    days: number[],
    alarmVideoId: string,
    contentVideoId: string,
    timerDuration: number,
  ): CreateRoutineDto {
    const sortedDays = CommonRoutineService.sortDays(days);

    return {
      user_id: userId,
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
