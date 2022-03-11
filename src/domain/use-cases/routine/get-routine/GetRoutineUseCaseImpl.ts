import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { GetRoutineResponseDto } from './dtos/GetRoutineResponseDto';
import { GetRoutineUsecaseParams } from './dtos/GetRoutineUsecaseParams';
import { GetRoutineUseCase } from './GetRoutineUseCase';

@Injectable()
export class GetRoutineDetailUseCaseImpl implements GetRoutineUseCase {
  constructor(private readonly _routineRepository: RoutineRepository) {}

  public async execute({
    routineId,
  }: GetRoutineUsecaseParams): GetRoutineResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    const mappedRoutine: GetRoutineResponseDto =
      this._mapModelToResponseDto(routine);

    return mappedRoutine;
  }

  private _mapModelToResponseDto(routine: RoutineModel) {
    const newRoutine: GetRoutineResponseDto = {
      id: routine['_id'],
      title: routine['title'],
      hour: routine['hour'],
      minute: routine['minute'],
      days: routine['days'],
      alarmVideoId: routine['alarm_video_id'],
      contentVideoId: routine['content_video_id'],
      timerDuration: routine['timer_duration'],
      activation: routine['activation'],
    };
    return newRoutine;
  }
}
