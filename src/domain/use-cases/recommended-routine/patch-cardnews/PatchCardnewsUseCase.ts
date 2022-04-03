import { UseCase } from '../../UseCase';
import { PatchCardnewsResponse } from '../response.index';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';

export abstract class PatchCardnewsUseCase
  implements UseCase<PatchCardnewsUseCaseParams, PatchCardnewsResponse>
{
  public abstract execute(
    params: PatchCardnewsUseCaseParams,
  ): PatchCardnewsResponse;
}
