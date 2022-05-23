import { UseCase } from '../../UseCase';
import { GetBannerResponseDto } from './dtos/GetBannerResponseDto';
import { GetBannerUseCaseParams } from './dtos/GetBannerUseCaseParams';

export abstract class GetBannerUseCase
  implements UseCase<GetBannerUseCaseParams, Promise<GetBannerResponseDto>>
{
  public abstract execute(
    params: GetBannerUseCaseParams,
  ): Promise<GetBannerResponseDto>;
}
