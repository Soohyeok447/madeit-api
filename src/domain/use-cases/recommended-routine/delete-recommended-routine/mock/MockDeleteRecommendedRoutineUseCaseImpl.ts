import { Injectable } from '@nestjs/common';
import { RecommendedRoutine } from '../../../../entities/RecommendedRoutine';
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
    recommendedRoutineId,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accessToken,
  }: DeleteRecommendedRoutineUseCaseParams): DeleteRecommendedRoutineResponse {
    const recommendedRoutine: RecommendedRoutine =
      await this._recommendRoutineRepository.findOne(recommendedRoutineId);

    if (!recommendedRoutine) throw new RecommendedRoutineNotFoundException();

    await this._recommendRoutineRepository.delete(recommendedRoutineId);

    return {};
  }
}
