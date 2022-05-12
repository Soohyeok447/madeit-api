import { MulterFile } from '../../../../common/types';

export class PatchThumbnailUseCaseParams {
  public readonly recommendedRoutineId: string;

  public readonly thumbnail: MulterFile;

  public readonly accessToken: string;
}
