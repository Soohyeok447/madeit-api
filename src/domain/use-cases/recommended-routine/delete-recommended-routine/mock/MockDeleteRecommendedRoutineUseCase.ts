import { Injectable } from '@nestjs/common';
import { UserNotFoundException } from '../../../../common/exceptions/customs/UserNotFoundException';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
import { User } from '../../../../entities/User';
import { RecommendedRoutineRepository } from '../../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../../repositories/user/UserRepository';
import { RecommendedRoutineNotFoundException } from '../../common/exceptions/RecommendedRoutineNotFoundException';
import { DeleteRecommendedRoutineResponse } from '../../response.index';
import { DeleteRecommendedRoutineUseCase } from '../DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseParams } from '../dtos/DeleteRecommendedRoutineUseCaseParams';

@Injectable()
export class MockDeleteRecommendedRoutineUseCaseImpl
  implements DeleteRecommendedRoutineUseCase
{
  public constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse {
    const user: User = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    await this._recommendRoutineRepository.delete(recommendedRoutineId);

    return {};
  }
}
