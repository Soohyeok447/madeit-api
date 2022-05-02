import { Injectable } from '@nestjs/common';
import { RoutineRepository } from '../../../repositories/routine/RoutineRepository';
import { DoneRoutineResponse } from '../response.index';
import { DoneRoutineUseCase } from './DoneRoutineUseCase';
import { DoneRoutineUseCaseParams } from './dtos/DoneRoutineUseCaseParams';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { RoutineNotFoundException } from '../../recommended-routine/patch-thumbnail/exceptions/RoutineNotFoundException';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { User } from '../../../entities/User';
import { Routine } from '../../../entities/Routine';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { Level } from '../../../common/enums/Level';
import { LoggerProvider } from '../../../providers/LoggerProvider';
import { CompleteRoutineRepository } from '../../../repositories/complete-routine/CompleteRoutineRepository';
import { PointHistoryRepository } from '../../../repositories/point-history/PointHistoryRepository';
import { MomentProvider } from '../../../providers/MomentProvider';
import { PointHistory } from '../../../entities/PointHistory';
import { ExceededPointLimitException } from './exceptions/ExceededPointLimitException';

@Injectable()
export class DoneRoutineUseCaseImpl implements DoneRoutineUseCase {
  public constructor(
    private readonly _routineRepository: RoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _recommendedRepository: RecommendedRoutineRepository,
    private readonly _logger: LoggerProvider,
    private readonly _completeRoutineRepository: CompleteRoutineRepository,
    private readonly _pointHistoryRepository: PointHistoryRepository,
    private readonly _momentProvider: MomentProvider,
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
      await this._completeRoutineRepository.save({
        userId,
        routineId,
      });

      return {};
    }

    const pointHistories: PointHistory[] =
      await this._pointHistoryRepository.findAllByUserId(userId);

    const pointsEarnedToday: number = pointHistories
      .map((e) => {
        const isToday: boolean = this._momentProvider.isToday(e.createdAt);

        if (isToday && e.point > 0) return e.point;
      })
      .filter((e) => e)
      .reduce((acc, cur) => acc + cur, 0);

    if (pointsEarnedToday >= 1000) {
      throw new ExceededPointLimitException(
        this._logger.getContext(),
        `포인트 제한 도달`,
      );
    }

    const point: number =
      pointsEarnedToday + recommendedRoutine.point > 1000
        ? user.point + (1000 - pointsEarnedToday)
        : user.point + recommendedRoutine.point;

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

    if (recommendedRoutine.point > 0) {
      await this._pointHistoryRepository.save(
        userId,
        `${recommendedRoutine.point} 포인트 적립 (루틴 달성)`,
        recommendedRoutine.point,
      );
    }

    return {};
  }
}
