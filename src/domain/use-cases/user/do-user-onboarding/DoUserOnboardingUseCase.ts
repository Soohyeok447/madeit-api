import { UseCase } from '../../UseCase';
import { DoUserOnboardingResponse } from '../response.index';
import { DoUserOnboardingUseCaseParams } from './dtos/DoUserOnboardingUseCaseParams';

/**
 * 간단 유저정보 저장
 */
export abstract class DoUseronboardingUseCase
  implements UseCase<DoUserOnboardingUseCaseParams, DoUserOnboardingResponse>
{
  abstract execute(
    params: DoUserOnboardingUseCaseParams,
  ): DoUserOnboardingResponse;
}
