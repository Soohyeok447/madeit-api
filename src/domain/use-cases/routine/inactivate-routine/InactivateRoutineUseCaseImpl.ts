import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { UserModel } from '../../../models/UserModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { InactivateRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { InactivateRoutineUseCaseParams } from './dtos/InactivateRoutineUseCaseParams';
import { InactivateRoutineUseCase } from './InactivateRoutineUseCase';
import { RoutineAlreadyInactivatedException } from './exceptions/RoutineAlreadyInactivatedException';
import { InactivateRoutineResponseDto } from './dtos/InactivateRoutineUseCaseResponseDto';

@Injectable()
export class InactivateRoutineUseCaseImpl implements InactivateRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: InactivateRoutineUseCaseParams): InactivateRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    await this._unactivateActivation(routine, routineId);

    const mappedRoutine: InactivateRoutineResponseDto =
      this._mapModelToResponseDto(routine);

    return mappedRoutine;
  }

  private async _unactivateActivation(
    routine: RoutineModel,
    routineId: string,
  ) {
    if (routine['activation']) {
      await this._routineRepository.update(routineId, { activation: false });
    } else {
      throw new RoutineAlreadyInactivatedException();
    }
  }

  private _mapModelToResponseDto(routine: RoutineModel) {
    const newRoutine: InactivateRoutineResponseDto = {
      id: routine['_id'],
      title: routine['title'],
      hour: routine['hour'],
      minute: routine['minute'],
      days: routine['days'],
      alarmVideoId: routine['alarm_video_id'],
      contentVideoId: routine['content_video_id'],
      timerDuration: routine['timer_duration'],
      activation: !routine['activation'],
    };
    return newRoutine;
  }
}
