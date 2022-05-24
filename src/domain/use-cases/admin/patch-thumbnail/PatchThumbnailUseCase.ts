import { UseCase } from '../../UseCase';
import { PatchThumbnailResponseDto } from './dtos/PatchThumbnailResponseDto';
import { PatchThumbnailUseCaseParams } from './dtos/PatchThumbnailUseCaseParams';

/**
 * 루틴 썸네일 수정
 *
 */
export abstract class PatchThumbnailUseCase
  implements
    UseCase<PatchThumbnailUseCaseParams, Promise<PatchThumbnailResponseDto>>
{
  public abstract execute(
    params: PatchThumbnailUseCaseParams,
  ): Promise<PatchThumbnailResponseDto>;
}
