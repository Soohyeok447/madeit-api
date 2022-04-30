import { MulterFile } from '../../../../common/types';

export class PutCardnewsUseCaseParams {
  public readonly userId: string;

  public readonly postId: string;

  public readonly cardnews: MulterFile[];
}
