import { MulterFile } from '../../../../common/types';

export class PatchThumbnailUseCaseParams {
  userId: string;

  recommendedRoutineId: string;

  thumbnail: MulterFile;
}
