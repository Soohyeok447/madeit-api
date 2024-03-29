import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutineResponse } from '../response.index';
import { GetRoutineUsecaseParams } from './dtos/GetRoutineUsecaseParams';
import { GetRoutineUseCase } from './GetRoutineUseCase';
import { Routine } from '../../../entities/Routine';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { RoutineNotFoundException } from '../../../common/exceptions/customs/RoutineNotFoundException';

@Injectable()
export class GetRoutineDetailUseCaseImpl implements GetRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    routineId,
  }: GetRoutineUsecaseParams): GetRoutineResponse {
    this._logger.setContext('GetRoutineDetail');

    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) {
      throw new RoutineNotFoundException(
        this._logger.getContext(),
        `미존재 루틴 find 시도.`,
      );
    }

    return {
      id: routine.id,
      title: routine.title,
      hour: routine.hour,
      minute: routine.minute,
      days: routine.days,
      alarmVideoId: routine.alarmVideoId,
      alarmType: routine.alarmType,
      contentVideoId: routine.contentVideoId,
      timerDuration: routine.timerDuration,
      activation: routine.activation,
      fixedFields: routine.fixedFields,
      point: routine.point,
      exp: routine.exp,
    };
  }
}
