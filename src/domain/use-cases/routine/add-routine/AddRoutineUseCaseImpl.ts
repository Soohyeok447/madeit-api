import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { AddRoutineResponse } from '../response.index';
import { AddRoutineUseCase } from './AddRoutineUseCase';
import { AddRoutineUsecaseParams } from './dtos/AddRoutineUsecaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { RoutineUtils } from '../common/RoutineUtils';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { User } from '../../../entities/User';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { Routine } from '../../../entities/Routine';
import { ConflictRoutineAlarmException } from '../common/exceptions/ConflictAlarmException';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class AddRoutineUseCaseImpl implements AddRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _recommendedRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
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
    this._logger.setContext('AddRoutine');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(`미가입 유저가 루틴 추가 시도. 호출자 id - ${userId}`);

      throw new UserNotFoundException();
    }

    const isHourValidate: boolean = RoutineUtils.validateHour(hour);

    if (!isHourValidate) throw new InvalidTimeException(hour);

    const isMinuteValidate: boolean = RoutineUtils.validateMinute(minute);

    if (!isMinuteValidate) throw new InvalidTimeException(minute);

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendedRoutineRepository.findOne(recommendedRoutineId);

    const existRoutines: Routine[] =
      await this._routineRepository.findAllByUserId(userId);

    const isDuplicated: Routine = existRoutines.find(
      (e) => e.hour === hour && e.minute === minute,
    );

    if (isDuplicated)
      throw new ConflictRoutineAlarmException(
        isDuplicated.days,
        isDuplicated.hour,
        isDuplicated.minute,
      );

    const newRoutine: Routine = await this._routineRepository.create({
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
}
