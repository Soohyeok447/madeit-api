import { UseCase } from '../../UseCase';
import { ModifyBannerResponseDto } from './dtos/ModifyBannerResponseDto';
import { ModifyBannerUseCaseParams } from './dtos/ModifyBannerUseCaseParams';

export abstract class ModifyBannerUseCase
  implements
    UseCase<ModifyBannerUseCaseParams, Promise<ModifyBannerResponseDto>>
{
  public abstract execute(
    params: ModifyBannerUseCaseParams,
  ): Promise<ModifyBannerResponseDto>;
}
