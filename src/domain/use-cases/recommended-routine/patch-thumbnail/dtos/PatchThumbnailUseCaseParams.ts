import { MulterFile } from '../../../../common/types';

export class PatchThumbnailUseCaseParams {
  public readonly userId: string;

  public readonly recommendedRoutineId: string;

  public readonly thumbnail: MulterFile;
}
