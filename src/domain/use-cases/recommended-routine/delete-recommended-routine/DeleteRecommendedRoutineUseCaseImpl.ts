import { Injectable } from '@nestjs/common';
import { RecommendedRoutineRepository } from '../../../repositories/recommended-routine/RecommendedRoutineRepository';
import { UserRepository } from '../../../repositories/user/UserRepository';
import { DeleteRecommendedRoutineResponse } from '../response.index';
import { DeleteRecommendedRoutineUseCase } from './DeleteRecommendedRoutineUseCase';
import { DeleteRecommendedRoutineUseCaseParams } from './dtos/DeleteRecommendedRoutineUseCaseParams';
import { UserNotFoundException } from '../../../common/exceptions/customs/UserNotFoundException';
import { UserNotAdminException } from '../../user/common/exceptions/UserNotAdminException';
import { RecommendedRoutineNotFoundException } from '../common/exceptions/RecommendedRoutineNotFoundException';
import { RecommendedRoutine } from '../../../entities/RecommendedRoutine';

@Injectable()
export class DeleteRecommendedRoutineUseCaseImpl
  implements DeleteRecommendedRoutineUseCase
{
  constructor(
    private readonly _recommendRoutineRepository: RecommendedRoutineRepository,
    private readonly _userRepository: UserRepository,
  ) {}

  public async execute({
    userId,
    recommendedRoutineId,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse {
    const user = await this._userRepository.findOne(userId);

    if (!user) throw new UserNotFoundException();

    if (!user.isAdmin) throw new UserNotAdminException();

    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    await this._recommendRoutineRepository.delete(recommendedRoutineId);

    return {};
  }
}
