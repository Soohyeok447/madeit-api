import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { CommonRoutineResponseDto } from '../common/CommonRoutineResponseDto';
import { GetRoutinesResponse } from '../response.index';
import { GetRoutinesUsecaseParams } from './dtos/GetRoutinesUsecaseParams';
import { GetRoutinesUseCase } from './GetRoutinesUseCase';

@Injectable()
export class GetAllRoutinesUseCaseImpl implements GetRoutinesUseCase {
  constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    userId,
  }: GetRoutinesUsecaseParams): GetRoutinesResponse {
    const routines: RoutineModel[] =
      await this._routineRepository.findAllByUserId(userId);

    const mappedResult: CommonRoutineResponseDto[] =
      this._mapModelsToResponseDtos(routines);

    return mappedResult;
  }

  private _mapModelsToResponseDtos(routines): CommonRoutineResponseDto[] {
    if (!routines.length) return [];

    return routines.map((routine) => {
      return {
        id: routine['_id'],
        title: routine['title'],
        hour: routine['hour'],
        minute: routine['minute'],
        days: routine['days'],
        alarmVideoId: routine['alarm_video_id'],
        contentVideoId: routine['content_video_id'],
        timerDuration: routine['timer_duration'],
        activation: routine['activation'],
        fixedFields: routine['fixed_fields'],
        point: routine['point'],
        exp: routine['exp'],
      };
    });
  }
}
