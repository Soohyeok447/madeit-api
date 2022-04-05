import { Injectable } from '@nestjs/common';
import { Routine } from '../../../entities/Routine';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { CommonRoutineResponseDto } from '../common/CommonRoutineResponseDto';
import { GetRoutinesResponse } from '../response.index';
import { GetRoutinesUsecaseParams } from './dtos/GetRoutinesUsecaseParams';
import { GetRoutinesUseCase } from './GetRoutinesUseCase';

@Injectable()
export class GetAllRoutinesUseCaseImpl implements GetRoutinesUseCase {
  public constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    userId,
  }: GetRoutinesUsecaseParams): GetRoutinesResponse {
    const routines: Routine[] = await this._routineRepository.findAllByUserId(
      userId,
    );

    const mappedResult: CommonRoutineResponseDto[] = routines.map((routine) => {
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
    });

    return mappedResult;
  }
}
