import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DoneRoutineResponse } from '../response.index';
import { DoneRoutineUseCase } from './DoneRoutineUseCase';
import { DoneRoutineUseCaseParams } from './dtos/DoneRoutineUseCaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { RecommendedRoutineNotFoundException } from './exceptions/RecommendedRoutineNotFoundException';
import { User } from '../../../entities/User';
import { Routine } from '../../../entities/Routine';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { Level } from '../../../common/enums/Level';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';

@Injectable()
export class DoneRoutineUseCaseImpl implements DoneRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _recommendedRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
    private readonly _completeRoutineRepository: CompleteRoutineRepository,
  ) {}

  public async execute({
    userId,
    routineId,
  }: DoneRoutineUseCaseParams): DoneRoutineResponse {
    this._logger.setContext('DoneRoutine');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      throw new UserNotFoundException(
        this._logger.getContext(),
        `미가입 유저가 루틴 완료 시도.`,
      );
    }

    const existingRoutine: Routine = await this._routineRepository.findOne(
      routineId,
    );

    if (!existingRoutine) {
      throw new RoutineNotFoundException(
        this._logger.getContext(),
        `미존재 루틴 완료 시도.`,
      );
    }

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendedRepository.findOne(
        existingRoutine.recommendedRoutineId,
      );

    if (!recommendedRoutine) {
      throw new RecommendedRoutineNotFoundException(
        this._logger.getContext(),
        `미존재 추천루틴으로 생성된 루틴 완료 시도.`,
      );
    }

    const point: number = user.point + recommendedRoutine.point;

    const exp: number = user.exp + recommendedRoutine.exp;

    user.setLevel(exp);

    const level: Level = user.level;

    await this._userRepository.update(userId, {
      point,
      exp,
      level,
    });

    await this._completeRoutineRepository.save({
      userId,
      routineId,
    });

    return {};
  }
}
