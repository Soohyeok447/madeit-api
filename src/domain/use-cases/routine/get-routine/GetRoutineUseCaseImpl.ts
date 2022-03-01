import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { MomentProvider } from '../../../providers/MomentProvider';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { GetRoutineResponseDto } from './dtos/GetRoutineResponseDto';
import { GetRoutineUsecaseParams } from './dtos/GetRoutineUsecaseParams';
import { GetRoutineUseCase } from './GetRoutineUseCase';

@Injectable()
export class GetRoutineDetailUseCaseImpl implements GetRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _momentProvider: MomentProvider,
  ) {}

  public async execute({
    routineId,
  }: GetRoutineUsecaseParams): GetRoutineResponse {
    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    const newRoutine: GetRoutineResponseDto =
      this._mapModelToResponseDto(routine);

    return newRoutine;
  }

  private _mapModelToResponseDto(routine: RoutineModel) {
    // 루틴 실행까지 남은 시간 계산해서
    const remainingTime = this._momentProvider.getRemainingTimeToRunAlarm(
      routine['days'],
      routine['hour'],
      routine['minute'],
    );

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
      secondToRunAlarm: remainingTime,
    };
    return newRoutine;
  }
}
