import { UseCase } from '../../UseCase';
import { DeleteBannerResponseDto } from './dtos/DeleteBannerResponseDto';
import { DeleteBannerUseCaseParams } from './dtos/DeleteBannerUseCaseParams';

export abstract class DeleteBannerUseCase
  implements
    UseCase<DeleteBannerUseCaseParams, Promise<DeleteBannerResponseDto>>
{
  public abstract execute(
    params: DeleteBannerUseCaseParams,
  ): Promise<DeleteBannerResponseDto>;
}
