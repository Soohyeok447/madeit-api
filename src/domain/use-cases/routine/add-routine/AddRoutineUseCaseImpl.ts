import { Injectable } from '@nestjs/common';
import { CreateRoutineDto } from '../../../repositories/routine/dtos/CreateRoutineDto';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUseCase } from './AddRoutineUseCase';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RoutineUtils } from '../common/RoutineUtils';
import { FixedField } from '../../../common/enums/FixedField';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
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
    recommendedRoutineId,
  }: AddRoutineUsecaseParams): AddRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const isHourValidate = RoutineUtils.validateHour(hour);

    if (!isHourValidate) throw new InvalidTimeException(hour);

    const isMinuteValidate = RoutineUtils.validateMinute(minute);

    if (!isMinuteValidate) throw new InvalidTimeException(minute);

    const recommendedRoutine = await this._recommendedRoutineRepository.findOne(
      recommendedRoutineId,
    );

    const createRoutineDto: CreateRoutineDto = this._mapParamsToCreateDto(
      userId,
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
      recommendedRoutine ? recommendedRoutine.fixedFields : [],
      recommendedRoutine ? recommendedRoutine.point : 0,
      recommendedRoutine ? recommendedRoutine.exp : 0,
    );

    const existRoutines = await this._routineRepository.findAllByUserId(userId);

    RoutineUtils.assertAlarmDuplication(createRoutineDto, existRoutines);

    const newRoutine = await this._routineRepository.create({
      userId,
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
      fixedFields: recommendedRoutine ? recommendedRoutine.fixedFields : [],
      point: recommendedRoutine ? recommendedRoutine.point : 0,
      exp: recommendedRoutine ? recommendedRoutine.exp : 0,
      recommendedRoutineId,
    });

    return {
      id: newRoutine.id,
      title: newRoutine.title,
      hour: newRoutine.hour,
      minute: newRoutine.minute,
      days: newRoutine.days,
      alarmVideoId: newRoutine.alarmVideoId,
      contentVideoId: newRoutine.contentVideoId,
      timerDuration: newRoutine.timerDuration,
      activation: newRoutine.activation,
      fixedFields: newRoutine.fixedFields,
      point: newRoutine.point,
      exp: newRoutine.exp,
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
    fixedFields: FixedField[],
    point: number,
    exp: number,
  ): CreateRoutineDto {
    return {
      userId,
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      contentVideoId,
      timerDuration,
      fixedFields,
      point,
      exp,
    };
  }
}
