import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { ModifyRoutineUsecaseParams } from './dtos/ModifyRoutineUsecaseParams';
import { ModifyRoutineUseCase } from './ModifyRoutineUseCase';
import { RoutineUtils } from '../common/RoutineUtils';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { InvalidTimeException } from '../common/exceptions/InvalidTimeException';
import { Routine } from '../../../entities/Routine';
import { RoutineNotFoundException } from '../../admin/recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { User } from '../../../entities/User';
import { ConflictRoutineAlarmException } from '../common/exceptions/ConflictAlarmException';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { ModifyRoutineResponseDto } from './dtos/ModifyRoutineResponseDto';
// import { isAlarmType } from '../../../common/types/AlarmType';
// import { InvalidAlarmTypeException } from '../common/exceptions/InvalidAlarmTypeException';

@Injectable()
export class ModifyRoutineUseCaseImpl implements ModifyRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    routineId,
    title,
    hour,
    minute,
    days,
    alarmVideoId,
    alarmType,
    contentVideoId,
    timerDuration,
  }: ModifyRoutineUsecaseParams): Promise<ModifyRoutineResponseDto> {
    this._logger.setContext('ModifyRoutine');

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
        `미가입 유저가 루틴 수정 시도.`,
      );
    }

    const existingRoutine: Routine = await this._routineRepository.findOne(
      routineId,
    );

    if (!existingRoutine) {
      throw new RoutineNotFoundException(
        this._logger.getContext(),
        `미존재 루틴 수정 시도.`,
      );
    }

    const isHourValidate: boolean = RoutineUtils.validateHour(hour);

    if (!isHourValidate)
      throw new InvalidTimeException(
        hour,
        this._logger.getContext(),
        `유효하지 않은 Hour ${hour}로 알람 수정 시도.`,
      );

    const isMinuteValidate: boolean = RoutineUtils.validateMinute(minute);

    if (!isMinuteValidate)
      throw new InvalidTimeException(
        minute,
        this._logger.getContext(),
        `유효하지 않은 minute ${minute}으로 알람 수정 시도.`,
      );

    const existRoutines: Routine[] =
      await this._routineRepository.findAllByUserId(userId);

    const isDuplicated: Routine = existRoutines
      .filter((e) => e.id !== routineId)
      .find((e) => e.hour === hour && e.minute === minute);

    if (isDuplicated)
      throw new ConflictRoutineAlarmException(
        isDuplicated.days,
        isDuplicated.hour,
        isDuplicated.minute,
        this._logger.getContext(),
        `중복되게 알람 수정 시도.`,
      );

    const modifiedRoutine: Routine = await this._routineRepository.update(
      routineId,
      {
        title,
        hour,
        minute,
        days,
        alarmVideoId,
        alarmType: alarmType ?? null,
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
      alarmType: modifiedRoutine.alarmType,
      contentVideoId: modifiedRoutine.contentVideoId,
      timerDuration: modifiedRoutine.timerDuration,
      activation: modifiedRoutine.activation,
      fixedFields: modifiedRoutine.fixedFields,
      point: modifiedRoutine.point,
      exp: modifiedRoutine.exp,
    };
  }
}
