import { UseCase } from '../../UseCase';
import { PatchThumbnailResponse } from '../response.index';
import { PatchThumbnailUseCaseParams } from './dtos/PatchThumbnailUseCaseParams';

/**
 * 루틴 썸네일 수정
 *
 */
export abstract class PatchThumbnailUseCase
  implements UseCase<PatchThumbnailUseCaseParams, PatchThumbnailResponse>
{
  abstract execute(params: PatchThumbnailUseCaseParams): PatchThumbnailResponse;
}
