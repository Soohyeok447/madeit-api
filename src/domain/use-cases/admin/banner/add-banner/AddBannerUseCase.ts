import { UseCase } from '../../../UseCase';
import { AddBannerResponseDto } from './dtos/AddBannerResponseDto';
import { AddBannerUseCaseParams } from './dtos/AddBannerUseCaseParams';

export abstract class AddBannerUseCase
  implements UseCase<AddBannerUseCaseParams, Promise<AddBannerResponseDto>>
{
  public abstract execute(
    params: AddBannerUseCaseParams,
  ): Promise<AddBannerResponseDto>;
}
