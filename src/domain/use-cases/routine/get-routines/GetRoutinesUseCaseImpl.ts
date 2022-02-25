import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { MomentProvider } from '../../../providers/MomentProvider';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { GetRoutinesResponse } from '../response.index';
import { CommonRoutineService } from '../service/CommonRoutineService';
import { GetRoutinesResponseDto } from './dtos/GetRoutinesResponseDto';
import { GetRoutinesUsecaseParams } from './dtos/GetRoutinesUsecaseParams';
import { GetRoutinesUseCase } from './GetRoutinesUseCase';

@Injectable()
export class GetAllRoutinesUseCaseImpl implements GetRoutinesUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _momentProvider: MomentProvider,

  ) { }

  public async execute({
    userId
  }: GetRoutinesUsecaseParams): GetRoutinesResponse {
    const routines: RoutineModel[] | [] = await this._routineRepository.findAllByUserId(userId);

    const mappedResult: GetRoutinesResponseDto[] = this._mapModelsToResponseDtos(routines);

    return mappedResult;
  }

  private _mapModelsToResponseDtos(routines): GetRoutinesResponseDto[] | [] {
    if (!routines.length) return [];

    return routines.map(routine => {
      // 루틴 실행까지 남은 시간 계산해서
      const remainingTime = this._momentProvider.getRemainingTimeToRunAlarm(
        routine['days'],
        routine['hour'],
        routine['minute']
      );

      const convertedDays: string[] | string = CommonRoutineService.convertDaysToString(routine['days']);

      return {
        id: routine['_id'],
        title: routine['title'],
        hour: routine['hour'],
        minute: routine['minute'],
        days: convertedDays,
        alarmVideoId: routine['alarm_video_id'],
        contentVideoId: routine['content_video_id'],
        timerDuration: routine['timer_duration'],
        activation: routine['activation'],
        secondToRunAlarm: remainingTime
      };
    })
  }
}
