import { UseCase } from '../../UseCase';
import { PatchCardnewsResponseDto } from './dtos/PatchCardnewsResponseDto';
import { PatchCardnewsUseCaseParams } from './dtos/PatchCardnewsUseCaseParams';

export abstract class PatchCardnewsUseCase
  implements
    UseCase<PatchCardnewsUseCaseParams, Promise<PatchCardnewsResponseDto>>
{
  public abstract execute(
    params: PatchCardnewsUseCaseParams,
  ): Promise<PatchCardnewsResponseDto>;
}
