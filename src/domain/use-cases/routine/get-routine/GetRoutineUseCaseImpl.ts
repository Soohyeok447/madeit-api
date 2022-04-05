import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutineResponse } from '../response.index';
import { GetRoutineUsecaseParams } from './dtos/GetRoutineUsecaseParams';
import { GetRoutineUseCase } from './GetRoutineUseCase';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { Routine } from '../../../entities/Routine';

@Injectable()
export class GetRoutineDetailUseCaseImpl implements GetRoutineUseCase {
  public constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    routineId,
  }: GetRoutineUsecaseParams): GetRoutineResponse {
    const routine: Routine = await this._routineRepository.findOne(routineId);

    if (!routine) throw new RoutineNotFoundException();

    return {
      id: routine.id,
      title: routine.title,
      hour: routine.hour,
      minute: routine.minute,
      days: routine.days,
      alarmVideoId: routine.alarmVideoId,
      contentVideoId: routine.contentVideoId,
      timerDuration: routine.timerDuration,
      activation: routine.activation,
      fixedFields: routine.fixedFields,
      point: routine.point,
      exp: routine.exp,
    };
  }
}
