import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DeleteRecommendedRoutineResponse } from '../response.index';
import { DeleteRecommendedRoutineUseCase } from './DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseParams } from './dtos/DeleteRecommendedRoutineUseCaseParams';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { UserNotAdminException } from '../../../common/exceptions/customs/UserNotAdminException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';
import { User } from '../../../entities/User';
import { LoggerProvider } from '../../../providers/LoggerProvider';

@Injectable()
export class DeleteRecommendedRoutineUseCaseImpl
  implements DeleteRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
    private readonly _logger: LoggerProvider,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse {
    this._logger.setContext('DeleteRecommendedRoutine');

    const user: User = await this._userRepository.findOne(userId);

    if (!user) {
      this._logger.error(
        `미가입 유저가 추천루틴 삭제 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotFoundException();
    }

    if (!user.isAdmin) {
      this._logger.error(
        `비어드민 유저가 추천루틴 삭제 시도. 호출자 id - ${userId}`,
      );
      throw new UserNotAdminException();
    }

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) {
      this._logger.error(`미존재 추천루틴 삭제 시도. 호출자 id - ${userId}`);
      throw new RecommendedRoutineNotFoundException();
    }

    await this._recommendRoutineRepository.delete(recommendedRoutineId);

    return {};
  }
}
