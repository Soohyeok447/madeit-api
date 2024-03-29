import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
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
import { AddRoutineResponseDto } from './dtos/AddRoutineResponseDto';
// import { InvalidAlarmTypeException } from '../common/exceptions/InvalidAlarmTypeException';
// import { isAlarmType } from '../../../common/types/AlarmType';

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
    alarmType,
    contentVideoId,
    timerDuration,
    recommendedRoutineId,
  }: AddRoutineUsecaseParams): Promise<AddRoutineResponseDto> {
    this._logger.setContext('AddRoutine');

    // if (alarmType && !isAlarmType(alarmType))
    //   throw new InvalidAlarmTypeException(
    //     alarmType,
    //     this._logger.getContext(),
    //     `유효하지 않은 알람타입 ${alarmType}입니다.`,
    //   );

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 루틴 추가 시도.`,
      );
    }

    const isHourValidate: boolean = RoutineUtils.validateHour(hour);

    if (!isHourValidate)
      throw new InvalidTimeException(
        hour,
        this._logger.getContext(),
        `유효하지 않은 Hour ${hour}로 알람 생성 시도.`,
      );

    const isMinuteValidate: boolean = RoutineUtils.validateMinute(minute);

    if (!isMinuteValidate)
      throw new InvalidTimeException(
        minute,
        this._logger.getContext(),
        `유효하지 않은 minute ${minute}으로 알람 생성 시도.`,
      );

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
        this._logger.getContext(),
        `중복된 알람 생성 시도.`,
      );

    const newRoutine: Routine = await this._routineRepository.create({
      userId,
      title,
      hour,
      minute,
      days,
      alarmVideoId,
      alarmType,
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
      alarmType: newRoutine.alarmType,
      contentVideoId: newRoutine.contentVideoId,
      timerDuration: newRoutine.timerDuration,
      activation: newRoutine.activation,
      fixedFields: newRoutine.fixedFields,
      point: newRoutine.point,
      exp: newRoutine.exp,
    };
  }
}
