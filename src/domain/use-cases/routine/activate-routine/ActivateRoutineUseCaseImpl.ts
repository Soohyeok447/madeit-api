import { Injectable } from '@nestjs/common';
import { RoutineModel } from '../../../models/RoutineModel';
import { UserModel } from '../../../models/UserModel';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { CommonUserService } from '../../user/common/CommonUserService';
import { ActivateRoutineResponse } from '../response.index';
import { CommonRoutineService } from '../common/CommonRoutineService';
import { ActivateRoutineUseCaseParams } from './dtos/ActivateRoutineUseCaseParams';
import { ActivateRoutineUseCase } from './ActivateRoutineUseCase';
import { RoutineAlreadyActivatedException } from './exceptions/RoutineAlreadyActivatedException';
import { ActivateRoutineResponseDto } from './dtos/ActivateRoutineResponseDto';

@Injectable()
export class ActivateRoutineUseCaseImpl implements ActivateRoutineUseCase {
  constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: ActivateRoutineUseCaseParams): ActivateRoutineResponse {
    const user: UserModel = await this._userRepository.findOne(userId);

    CommonUserService.assertUserExistence(user);

    const routine: RoutineModel = await this._routineRepository.findOne(
      routineId,
    );

    CommonRoutineService.assertRoutineExistence(routine);

    await this._activateActivation(routine, routineId);

    const mappedRoutine: ActivateRoutineResponseDto =
      this._mapModelToResponseDto(routine);

    return mappedRoutine;
  }

  private async _activateActivation(routine: RoutineModel, routineId: string) {
    if (!routine['activation']) {
      await this._routineRepository.update(routineId, { activation: true });
    } else {
      throw new RoutineAlreadyActivatedException();
    }
  }

  private _mapModelToResponseDto(routine: RoutineModel) {
    const newRoutine: ActivateRoutineResponseDto = {
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
