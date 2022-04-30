import { ObjectId } from '../../../common/types';

export class UpdateBoardDto {
  public readonly title?: string;

  public readonly views?: number;

  public readonly cardnewsId?: ObjectId;
}
